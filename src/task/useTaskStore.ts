import { create } from "zustand";
import type { Task } from "@/task/Task";
import { fetchTasks, deleteTask, fetchTasksForProcess } from "@/task/taskApi";

type TaskStore = {
  tasksById: Record<string, Task>;
  tasks: Task[];
  selectedTask: Task | null;
  deleteCandidate: Task | null;

  setTasks: (tasks: Task[]) => void;
  selectTask: (task: Task | null) => void;
  setDeleteCandidate: (task: Task | null) => void;

  loadTasks: () => Promise<void>;
  loadTasksForProcess: (processId: string) => Promise<void>;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  deleteSelectedTask: () => Promise<void>;
  moveTask: (index: number, direction: number) => void;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasksById: {},
  tasks: [],
  selectedTask: null,
  deleteCandidate: null,

  setTasks: (tasks) =>
    set((state) => {
      const updatedById = { ...state.tasksById };
      for (const t of tasks) {
        updatedById[t.id] = t;
      }
      return { tasks, tasksById: updatedById };
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

  loadTasksForProcess: async (processId) => {
    if (!processId) {
      set({ tasks: [] });
      return;
    }
    try {
      const tasks = await fetchTasksForProcess(processId);
      const tasksMap: Record<string, Task> = {};
      for (const t of tasks) tasksMap[t.id] = t;

      set((state) => ({
        tasksById: { ...state.tasksById, ...tasksMap },
        tasks, // nur für UI-Anzeige
      }));
    } catch (err) {
      console.error("Fehler beim Laden der Tasks für den Prozess:", err);
      set({ tasks: [] });
    }
  },

  updateTask: (task) =>
    set((state) => ({
      tasksById: { ...state.tasksById, [task.id]: task },
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),

  addTask: (task) =>
    set((state) => ({
      tasksById: { ...state.tasksById, [task.id]: task },
      tasks: [...state.tasks, task],
    })),

  moveTask: (index, direction) => {
    const tasks = [...get().tasks];
    const target = index + direction;
    if (target < 0 || target >= tasks.length) return;
    [tasks[index], tasks[target]] = [tasks[target], tasks[index]];
    set({ tasks });
  },

  deleteSelectedTask: async () => {
    const task = get().deleteCandidate;
    if (!task) return;
    try {
      await deleteTask(task.id);
      set((state) => {
        const newById = { ...state.tasksById };
        delete newById[task.id];
        return {
          tasksById: newById,
          tasks: state.tasks.filter((t) => t.id !== task.id),
          deleteCandidate: null,
        };
      });
    } catch (err) {
      console.error("Fehler beim Löschen des Tasks:", err);
    }
  },
}));

export default useTaskStore;
