import { create } from 'zustand'

type Process = {
  id: string
  title: string
  done: boolean
}

type State = {
  processes: Process[]
  addProcess: (process: Process) => void
  toggleDone: (id: string) => void
}

export const useProcessStore = create<State>((set) => ({
  processes: [],
  addProcess: (process) =>
    set((state) => ({ processes: [...state.processes, process] })),
  toggleDone: (id) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === id ? { ...p, done: !p.done } : p
      ),
    })),
}))
