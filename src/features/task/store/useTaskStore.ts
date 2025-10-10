import { create } from "zustand";
import type { Task } from "../Task";
import { fetchTasksForProcess, deleteTask, fetchTasks } from "../api/taskApi";
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
  deleteSelectedTask: () => Promise<void>;
  moveTask: (processId: string, oldIndex: number, newIndex: number) => void;
  getTaskById: (id?: string) => Task | undefined;
  deleteTasksByProcessId: (processId: string) => Promise<void>; // 👈 hinzufügen
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

  loadTasksForProcess: async (processId) => {
    if (!processId) return;

    // ⚡️ erst prüfen, ob schon geladen
    if (get().tasksByProcessId[processId]) return;

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

  addTask: (task) =>
    set((state) => {
      const tasksByProcessId = { ...state.tasksByProcessId };
      if (task.processId) {
        tasksByProcessId[task.processId] = [
          ...(tasksByProcessId[task.processId] ?? []),
          task,
        ];
      }
      return {
        tasksById: { ...state.tasksById, [task.id]: task },
        tasksByProcessId,
      };
    }),

  moveTask: (processId: string, oldIndex: number, newIndex: number) => {
    const tasks = [...(get().tasksByProcessId[processId] ?? [])];
    if (!tasks.length) return;

    const updatedTasks = arrayMove(tasks, oldIndex, newIndex);

    set((state) => ({
      tasksByProcessId: { ...state.tasksByProcessId, [processId]: updatedTasks },
    }));
  },


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
