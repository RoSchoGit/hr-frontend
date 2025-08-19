import { create } from "zustand";
import type { Process } from "@/process/Process";
import { fetchProcesses, deleteProcess } from "@/process/processApi";
import { createProcess } from "@/process/processApi";

type ProcessStore = {
  processes: Process[];
  selectedProcess: Process | null;
  deleteCandidate: Process | null;
  setProcesses: (processes: Process[]) => void;
  selectProcess: (process: Process | null) => void;
  setDeleteCandidate: (process: Process | null) => void;
  loadProcesses: () => Promise<void>;
  deleteSelectedProcess: () => Promise<void>;
  addProcess: (process: Process) => void;
  updateProcess: (process: Process) => void;
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  selectedProcess: null,
  deleteCandidate: null,

  setProcesses: (processes) => set({ processes }),
  selectProcess: (process) => set({ selectedProcess: process }),
  setDeleteCandidate: (process) => set({ deleteCandidate: process }),

  loadProcesses: async () => {
    try {
      const processes = await fetchProcesses();
  
      const parsedProcesses = processes.map(p => ({
        ...p,
        tasks: p.tasks ?? [],
        industries: p.industries ?? [],
        history: p.history ?? [],
        createdAt: new Date(p.createdAt),
        dueDate: p.dueDate ? new Date(p.dueDate) : undefined,
        completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
      }));
  
      set({ processes: parsedProcesses });
    } catch (err) {
      console.error("Fehler beim Laden der Processes:", err);
    }
  },

  deleteSelectedProcess: async () => {
    const process = get().deleteCandidate;
    if (!process) return;
    try {
      await deleteProcess(process.id);
      set((state) => ({
        processes: state.processes.filter((t) => t.id !== process.id),
        deleteCandidate: null,
      }));
    } catch (err) {
      console.error("Fehler beim Löschen des Processes:", err);
    }
  },

  addProcess: async (process) => {
    try {
      const created = await createProcess(process);
      set((state) => ({
        processes: [...state.processes, created],
      }));
    } catch (err) {
      console.error("Fehler beim Erstellen des Prozesses:", err);
    }
  },

  updateProcess: (updatedProcess) => {
    set((state) => ({
      processes: state.processes.map(p =>
        p.id === updatedProcess.id ? updatedProcess : p
      ),
    }));
  },

}));

export default useProcessStore;
