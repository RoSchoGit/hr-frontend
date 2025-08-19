import type { Process } from "@/process/Process";
import { useEffect, useRef, useMemo } from "react";
import { useProcessStore } from "@/process/useProcessStore";
import { useTaskStore } from "@/task/useTaskStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProcessCard from "./ProcessCard";

const ProcessListPage = () => {
  const {
    processes,
    deleteCandidate,
    setDeleteCandidate,
    loadProcesses,
    selectProcess
  } = useProcessStore();

  const { loadTasksForProcess } = useTaskStore();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  // Sortierung: DONE → OPEN → IN_PROGRESS → ARCHIVED
  // IN_PROGRESS landet unten, da wir ans Ende scrollen
  const sortedProcesses = useMemo(() => {
    const order: Record<Process["status"], number> = {
      ARCHIVED: 0,
      DONE: 1,
      OPEN: 2,
      IN_PROGRESS: 3
    };
    return [...(processes || [])].sort((a, b) => order[a.status] - order[b.status]);
  }, [processes]);

  // Automatisch nach unten scrollen
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [sortedProcesses.length]);

  const handleProcessClick = async (process: Process) => {
    await loadTasksForProcess(process.id);
    selectProcess(process);
    navigate(`${process.id}/tasks`);
  };

  const handleDelete = () => {
    setDeleteCandidate(null);
  };

  const handleEditProcess = (process: Process) => {
    navigate(`/processes/${process.id}/edit`);
  };

  const handleInfoProcess = (process: Process) => {
    navigate(`/processes/${process.id}`);
  };

  return (
    <div
      ref={listRef}
      className="flex flex-col min-h-full gap-1 overflow-y-auto"
      style={{ maxHeight: "100%" }}
    >
      {sortedProcesses.map((process) => (
        <ProcessCard
          key={process.id}
          process={process}
          handleClick={handleProcessClick}
          setDeleteCandidate={setDeleteCandidate}
          menuOpen={openMenuId === process.id}
          setMenuOpen={(open: boolean) => setOpenMenuId(open ? process.id : null)}
          onEdit={handleEditProcess}
          onInfo={handleInfoProcess}
        />
      ))}

      {deleteCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Prozess löschen?</h2>
            <p className="mb-4">
              Möchtest du <strong>{deleteCandidate.title}</strong> wirklich löschen?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteCandidate(null)}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessListPage;
