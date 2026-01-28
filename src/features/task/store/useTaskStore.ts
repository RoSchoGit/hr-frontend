import { create } from "zustand";
import type { Task } from "../Task";
import { fetchTasksForProcess, deleteTask, fetchTasks, createTasksForProcess, updateTaskPositions } from "../api/taskApi";
import { arrayMove } from "@dnd-kit/sortable";

type TaskStore = {
  tasksById: Record<string, Task>;
  tasksByProcessId: Record<string, Task[]>;   // 👈 NEU
  selectedTask: Task | null;
  deleteCandidate: Task | null;

  setTasks: (tasks: Task[]) => void;
  selectTask: (task: Task | null) => void;
  setDeleteCandidate: (task: Task | null) => void;

  loadTasks: () => Promise<void>;
  loadTasksForProcess: (processId: string) => Promise<void>;
  getTasksForProcess: (processId?: string) => Task[];   // 👈 NEU

  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  updateTasksForProcess: (processId: string) => Promise<void>;

  deleteSelectedTask: () => Promise<void>;
  moveTask: (processId: string, oldIndex: number, newIndex: number) => void;
  getTaskById: (id?: string) => Task | undefined;
  deleteTasksByProcessId: (processId: string) => Promise<void>; // 👈 hinzufügen
  newTasks: Task[];         // 👈 lokal erstellte, noch nicht gespeicherte Tasks
  deletedTaskIds: string[]; // 👈 nur IDs von gelöschten Tasks
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasksById: {},
  tasksByProcessId: {},   // 👈 NEU
  selectedTask: null,
  deleteCandidate: null,

  setTasks: (tasks) =>
    set((state) => {
      const updatedById = { ...state.tasksById };
      for (const t of tasks) updatedById[t.id] = t;
      return { tasksById: updatedById };
    }),

  selectTask: (task) => set({ selectedTask: task }),
  setDeleteCandidate: (task) => set({ deleteCandidate: task }),

  loadTasks: async () => {
    try {
      const tasks = await fetchTasks();
      get().setTasks(tasks);
    } catch (err) {
      console.error("Fehler beim Laden der Tasks:", err);
    }
  },

  getTaskById: (id?: string) => {
    if (!id) return undefined;
    return get().tasksById[id];
  },

  deleteTasksByProcessId: async (processId: string) => {
    try {
      // 👉 Falls deine API sowas unterstützt
      // await deleteTasksForProcess(processId);

      set((state) => {
        const newById = { ...state.tasksById };
        const tasks = state.tasksByProcessId[processId] ?? [];

        // alle Task-IDs aus tasksById entfernen
        for (const t of tasks) {
          delete newById[t.id];
        }

        const newByProcessId = { ...state.tasksByProcessId };
        delete newByProcessId[processId];

        return {
          tasksById: newById,
          tasksByProcessId: newByProcessId,
        };
      });
    } catch (err) {
      console.error("Fehler beim Löschen der Tasks für Prozess:", err);
    }
  },

  getTasksForProcess: (processId) => {
    if (!processId) return [];
    return get().tasksByProcessId[processId] ?? [];
  },

  updateTask: (task) =>
    set((state) => {
      const tasksByProcessId = { ...state.tasksByProcessId };
      if (task.processId && tasksByProcessId[task.processId]) {
        tasksByProcessId[task.processId] = tasksByProcessId[task.processId].map((t) =>
          t.id === task.id ? task : t
        );
      }
      return {
        tasksById: { ...state.tasksById, [task.id]: task },
        tasksByProcessId,
      };
    }),

  newTasks: [],
  deletedTaskIds: [],


  updateTasksForProcess: async (processId: string) => {
    if (!processId) return;
    try {
      const allTasks = get().getTasksForProcess(processId);
      if (!allTasks || !allTasks.length) {
        console.warn("Keine Tasks zum Aktualisieren für Prozess:", processId);
        return;
      }

      // ---------------------------
      // NEW: Validate positions are contiguous (either 0-based or 1-based).
      // Wenn die Reihenfolge nicht lückenlos ist, nur Warnung ausgeben und weitermachen.
      // ---------------------------
      const positions = allTasks.map(t => (typeof t.position === "number" ? t.position : NaN));
      const missingPosition = positions.some(p => Number.isNaN(p));
      if (missingPosition) {
        console.warn("updateTasksForProcess: Einige Tasks haben kein gültiges 'position' Feld:", {
          taskCount: allTasks.length,
          positions,
        });
      } else {
        const unique = Array.from(new Set(positions)).sort((a, b) => a - b);
        const n = unique.length;
        const expected0 = Array.from({ length: n }, (_, i) => i);
        const expected1 = Array.from({ length: n }, (_, i) => i + 1);

        const matches0 = unique.every((v, i) => v === expected0[i]);
        const matches1 = unique.every((v, i) => v === expected1[i]);

        if (!matches0 && !matches1) {
          // Build helpful debug info: missing and duplicate values
          const min = Math.min(...unique);
          const max = Math.max(...unique);
          const missingVals = [];
          for (let i = min; i <= max; i++) if (!unique.includes(i)) missingVals.push(i);
          const duplicates = positions.filter((p, idx) => positions.indexOf(p) !== idx);

          console.warn(
            "updateTasksForProcess: Positions sind nicht lückenlos durchnummeriert (erwarte 0..n-1 oder 1..n). " +
            "Speichern wird dennoch fortgesetzt. Details:",
            {
              taskCount: allTasks.length,
              uniqueSortedPositions: unique,
              min,
              max,
              missingValuesInRange: missingVals,
              duplicatePositions: duplicates.length ? Array.from(new Set(duplicates)) : undefined,
            }
          );
        }
      }
      // ---------------------------
      // Ende der neuen Validierung — ab hier bleibt die ursprüngliche Logik unverändert.
      // ---------------------------

      // 1) find new (temp) tasks in the store for this process
      const isTemp = (id?: string) => !!id && id.startsWith("temp-");
      const newTasks = allTasks.filter(t => isTemp(t.id) && t.processId === processId);

      // 2) positions payload for existing tasks (based on final order)
      const positionsPayload: { id: string; position: number }[] = [];
      allTasks.forEach((t, idx) => {
        if (!isTemp(t.id)) {
          positionsPayload.push({ id: t.id, position: idx + 1 });
        }
      });

      // 3) create new tasks (if any)
      if (newTasks.length) {
        console.log("new Tasks: ", newTasks);
        await createTasksForProcess(processId, newTasks);
      }

      // 4) update positions for existing tasks
      if (positionsPayload.length) {
        console.log("positionsPayload: ", positionsPayload);
        await updateTaskPositions(processId, positionsPayload);
      }

      // 5) authoritative fetch: get all saved tasks from backend for this process
      const savedTasks = await fetchTasksForProcess(processId);

      // 6) update store: remove temp tasks for this process and replace with savedTasks
      set((state) => {
        // build new tasksById: start from existing, remove temp tasks for this process
        const newTasksById = { ...state.tasksById };
        const processList = state.tasksByProcessId[processId] ?? [];
        for (const t of processList) {
          if (isTemp(t.id)) {
            delete newTasksById[t.id];
          }
        }

        // merge saved tasks into tasksById
        for (const t of savedTasks) {
          newTasksById[t.id] = t;
        }

        // set authoritative list for this process
        const newTasksByProcessId = { ...state.tasksByProcessId, [processId]: savedTasks };

        // remove persisted newTasks belonging to this process from newTasks[]
        const filteredNewTasks = state.newTasks.filter(nt => !(nt.processId === processId && isTemp(nt.id)));

        return {
          tasksById: newTasksById,
          tasksByProcessId: newTasksByProcessId,
          newTasks: filteredNewTasks,
        };
      });

      console.log(`✅ Tasks for process ${processId} synced (created=${newTasks.length}, positions=${positionsPayload.length})`);
    } catch (err) {
      console.error("Fehler beim Persistieren der Tasks für Prozess:", err);
      throw err;
    }
  },


  addTask: (task) =>
    set((state) => {
      const id = task.id ?? `temp-${crypto?.randomUUID?.() ?? Date.now()}`;
      const taskWithId = { ...task, id };
      const tasksByProcessId = { ...state.tasksByProcessId };
      if (taskWithId.processId) {
        tasksByProcessId[taskWithId.processId] = [
          ...(tasksByProcessId[taskWithId.processId] ?? []),
          taskWithId,
        ];
      }
      return {
        tasksById: { ...state.tasksById, [taskWithId.id]: taskWithId },
        tasksByProcessId,
        newTasks: [...state.newTasks, taskWithId],
      };
    }),

  // loadTasksForProcess mit force-flag
  loadTasksForProcess: async (processId, force = false) => {
    if (!processId) return;
    if (!force && get().tasksByProcessId[processId]) return;
    try {
      const tasks = await fetchTasksForProcess(processId);
      const tasksMap: Record<string, Task> = {};
      for (const t of tasks) tasksMap[t.id] = t;
      set((state) => ({
        tasksById: { ...state.tasksById, ...tasksMap },
        tasksByProcessId: { ...state.tasksByProcessId, [processId]: tasks },
      }));
    } catch (err) {
      console.error("Fehler beim Laden der Tasks für den Prozess:", err);
    }
  },

  // setTasksForProcess (explizit setzen, nützlich nach Save)
  setTasksForProcess: (processId: string, tasks: Task[]) =>
    set((state) => {
      const tasksMap: Record<string, Task> = {};
      for (const t of tasks) tasksMap[t.id] = t;
      return {
        tasksById: { ...state.tasksById, ...tasksMap },
        tasksByProcessId: { ...state.tasksByProcessId, [processId]: tasks },
        // newTasks/deletedTaskIds bewusst nicht automatisch ändern — das machst du explizit beim Save
      };
    }),

  clearNewAndDeleted: () =>
    set(() => ({ newTasks: [], deletedTaskIds: [] })),

  moveTask: (processId: string, oldIndex: number, newIndex: number) => {
    const tasks = [...(get().tasksByProcessId[processId] ?? [])];
    if (!tasks.length) return;

    const updatedTasks = arrayMove(tasks, oldIndex, newIndex);

    // Reassign positions based on new order (1-based)
    const rePositioned = updatedTasks.map((t, idx) => ({ ...t, position: idx + 1 }));

    // Update tasksById mapping for these tasks
    const updatedById = { ...get().tasksById };
    for (const t of rePositioned) {
      updatedById[t.id] = t;
    }

    set(() => ({
      tasksByProcessId: { ...get().tasksByProcessId, [processId]: rePositioned },
      tasksById: updatedById,
    }));
  },

  markTaskAsDeleted: (id: string) =>
    set((state) => ({
      deletedTaskIds: [...state.deletedTaskIds, id],
      tasksByProcessId: Object.fromEntries(
        Object.entries(state.tasksByProcessId).map(([pid, tasks]) => [
          pid,
          tasks.filter((t) => t.id !== id),
        ])
      ),
    })),

  deleteSelectedTask: async () => {
    const task = get().deleteCandidate;
    if (!task) return;
    try {
      await deleteTask(task.id);
      set((state) => {
        const newById = { ...state.tasksById };
        delete newById[task.id];

        const tasksByProcessId = { ...state.tasksByProcessId };
        if (task.processId && tasksByProcessId[task.processId]) {
          tasksByProcessId[task.processId] = tasksByProcessId[task.processId].filter(
            (t) => t.id !== task.id
          );
        }

        return {
          tasksById: newById,
          tasksByProcessId,
          deleteCandidate: null,
        };
      });
    } catch (err) {
      console.error("Fehler beim Löschen des Tasks:", err);
    }
  },
}));
