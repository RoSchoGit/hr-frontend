import { create } from "zustand";
import { ProcessType, type Process, ProcessStatus } from "@/features/process/Process";
import { fetchProcesses, deleteProcess } from "@/features/process/api/processApi";
import { createProcess } from "@/features/process/api/processApi";
import { v4 as uuidv4 } from "uuid";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { updateProcess as apiUpdateProcess } from "@/features/process/api/processApi";


export type SortKey =
  | "STATUS"
  | "DUE_DATE_ASC"
  | "DUE_DATE_DESC"
  | "CREATOR_ASC"
  | "CREATOR_DESC"
  | "CREATED_AT_DESC";

type ProcessStore = {
  processes: Process[];
  selectedProcess: Process | null;
  deleteCandidate: Process | null;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  setProcesses: (processes: Process[]) => void;
  selectProcess: (process: Process | null) => void;
  setDeleteCandidate: (process: Process | null) => void;
  loadProcesses: () => Promise<void>;
  deleteSelectedProcess: () => Promise<void>;
  addProcess: (process: Process) => void;
  updateProcess: (process: Process) => void;
  createNewProcess: (title: string, description: string, type: ProcessType) => Process;
  getProcessById: (id: string) => Process | null;
  resetSelectedProcess: () => void;
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  selectedProcess: null,
  deleteCandidate: null,
  sortKey: "STATUS",
  setSortKey: (key: SortKey) => set({ sortKey: key }),
  
  setProcesses: (processes) => set({ processes }),
  selectProcess: (process) => set({ selectedProcess: process }),
  setDeleteCandidate: (process: Process | null) => set({ deleteCandidate: process }),
  resetSelectedProcess: () => set({ selectedProcess: undefined }),
  loadProcesses: async () => {
    try {
      const processes = await fetchProcesses();
      const parsed = processes.map(p => ({
        ...p,
        //   tasks: p.tasks ?? [],
        industries: p.industries ?? [],
        //     history: p.history ?? [],
        createdAt: new Date(p.createdAt).toISOString().substring(0, 19),
        dueDate: p.dueDate ? new Date(p.dueDate).toISOString().substring(0, 19) : undefined,
        completedAt: p.completedAt ? new Date(p.completedAt).toISOString().substring(0, 19) : undefined,
      }));
      set({ processes: parsed });
    } catch (err) {
      console.error("Fehler beim Laden der Processes:", err);
    }
  },

  deleteSelectedProcess: async () => {
    const process = get().deleteCandidate;
    if (!process) return;

    try {
      const { deleteTasksByProcessId } = useTaskStore.getState();

      await deleteTasksByProcessId(process.id);
      await deleteProcess(process.id);

      set((state) => ({
        processes: state.processes.filter((p) => p.id !== process.id),
        deleteCandidate: null, // Dialog schließen
      }));
    } catch (err) {
      console.error("Fehler beim Löschen des Prozesses:", err);
    }
  },


  createNewProcess: (title, description, type) => {
    const process: Process = {
      id: uuidv4(),
      title,
      description,
      type,
      status: ProcessStatus.OPEN,
      //  tasks: [],
      industries: [],
      //  history: [],
      createdAt: new Date().toISOString().substring(0, 19),
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

  updateProcess: async (updatedProcess) => {
    try {
      const returned = await apiUpdateProcess(updatedProcess.id, updatedProcess);

      // Keine Date-Objekte mehr — direkt Strings übernehmen
      const normalized: Process = {
        ...returned,
        createdAt: returned.createdAt ?? undefined,
        dueDate: returned.dueDate ?? undefined,
        completedAt: returned.completedAt ?? undefined,
        industries: returned.industries ?? [],
      };

      // update store
      set((state) => {
        const updatedList = state.processes.map(p => (p.id === normalized.id ? normalized : p));
        const selectedProcess = state.selectedProcess?.id === normalized.id
          ? normalized
          : state.selectedProcess;

        return { processes: updatedList, selectedProcess };
      });
    } catch (err) {
      console.error("Fehler beim Persistieren des Prozesses:", err);
      throw err;
    }
  },

  getProcessById: (id: string) => {
    return get().processes.find((p) => p.id === id) ?? null;
  },

}));

export default useProcessStore;
