import type { Process } from "@/features/process/Process";
import { useEffect, useRef, useMemo, useState } from "react";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useNavigate } from "react-router-dom";
import ProcessCard from "@/features/process/components/ProcessCard";
import Loader from "@/components/Loader";
import DeleteProcessConfirmModal from "./DeleteProcessConfirmModal";

const ProcessListPage = () => {
  const {
    processes,
    deleteCandidate,
    setDeleteCandidate,
    loadProcesses,
    selectProcess,
    deleteSelectedProcess
  } = useProcessStore();
  const { loadTasksForProcess } = useTaskStore();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadProcesses();
  }, []);

  // Sortierung: ARCHIVED → DONE → OPEN → IN_PROGRESS
  const sortedProcesses = useMemo(() => {
    const order: Record<Process["status"], number> = {
      ARCHIVED: 3,
      DONE: 2,
      OPEN: 1,
      IN_PROGRESS: 0
    };
    return [...(processes || [])].sort((a, b) => order[a.status] - order[b.status]);
  }, [processes]);

  // Automatisch nach unten scrollen
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [sortedProcesses.length]);

  // Schließen bei Klick außerhalb
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    document.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  const handleProcessClick = async (process: Process) => {
    await loadTasksForProcess(process.id);
    selectProcess(process);
    navigate(`${process.id}/tasks`);
  };

  const handleEditProcess = (process: Process) => {
    navigate(`/processes/${process.id}/edit`);
  };

  const handleInfoProcess = (process: Process) => {
    navigate(`/processes/${process.id}`);
  };

  if (!sortedProcesses || sortedProcesses.length == 0) {
    return (
      <div style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader loading={true} size={36} message="Prozesse werden geladen…" />
      </div>
    )
  }

  return (
    <div
      ref={listRef}
      className="flex flex-col-reverse min-h-full gap-2 p-2 sm:p-4 overflow-y-auto"
      style={{ maxHeight: "100%" }}
    >
      {sortedProcesses.map((process) => (
        <div key={process.id} className="w-full">
          <ProcessCard
            process={process}
            handleClick={handleProcessClick}
            setDeleteCandidate={setDeleteCandidate}
            menuOpen={openMenuId === process.id}
            setMenuOpen={(open: boolean) => setOpenMenuId(open ? process.id : null)}
            onEdit={handleEditProcess}
            onInfo={handleInfoProcess}
          />
        </div>
      ))}
      <DeleteProcessConfirmModal />
    </div>
  );
};

export default ProcessListPage;
