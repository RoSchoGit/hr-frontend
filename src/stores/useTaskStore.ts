import { create } from "zustand";
import type { Task } from "@/models/Task";
import { fetchTasks, deleteTask } from "@/stores/taskApi";

type TaskStore = {
  tasks: Task[];
  selectedTask: Task | null;
  deleteCandidate: Task | null;
  setTasks: (tasks: Task[]) => void;
  selectTask: (task: Task | null) => void;
  setDeleteCandidate: (task: Task | null) => void;
  loadTasks: () => Promise<void>;
  deleteSelectedTask: () => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTask: null,
  deleteCandidate: null,

  setTasks: (tasks) => set({ tasks }),
  selectTask: (task) => set({ selectedTask: task }),
  setDeleteCandidate: (task) => set({ deleteCandidate: task }),

  loadTasks: async () => {
    try {
      const tasks = await fetchTasks();
      set({ tasks });
    } catch (err) {
      console.error("Fehler beim Laden der Tasks:", err);
    }
  },

  deleteSelectedTask: async () => {
    const task = get().deleteCandidate;
    if (!task) return;
    try {
      await deleteTask(task.id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== task.id),
        deleteCandidate: null,
      }));
    } catch (err) {
      console.error("Fehler beim Löschen des Tasks:", err);
    }
  },
}));

export default useTaskStore;
