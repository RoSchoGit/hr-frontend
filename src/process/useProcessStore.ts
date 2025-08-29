import { create } from "zustand";
import { ProcessType, type Process, ProcessStatus } from "@/process/Process";
import { fetchProcesses, deleteProcess } from "@/process/processApi";
import { createProcess } from "@/process/processApi";
import { v4 as uuidv4 } from "uuid";

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
  createNewProcess: (title: string, description: string, type: ProcessType) => Process;
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

  createNewProcess: (title, description, type) => {
    const process: Process = {
      id: uuidv4(),
      title,
      description,
      type,
      status: ProcessStatus.OPEN,
      tasks: [],
      industries: [],
      history: [],
      createdAt: new Date(),
      creator: "currentUser" 
    };
    set({ selectedProcess: process });
    return process;
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
