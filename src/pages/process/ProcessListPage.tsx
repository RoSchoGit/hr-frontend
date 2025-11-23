import type { Process } from "@/features/process/Process";
import { useEffect, useRef, useMemo, useState } from "react";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useNavigate } from "react-router-dom";
import ProcessCard from "@/features/process/components/ProcessCard";
import Loader from "@/components/Loader";
import DeleteProcessConfirmModal from "./DeleteProcessConfirmModal";

const ProcessListPage = () => {
  // gezielte Selektoren (vermeidet neue Objekt-Referenzen bei jedem Render)
  const processes = useProcessStore((s) => s.processes);
  const setDeleteCandidate = useProcessStore((s) => s.setDeleteCandidate);
  const loadProcesses = useProcessStore((s) => s.loadProcesses);
  const selectProcess = useProcessStore((s) => s.selectProcess);
  const deleteSelectedProcess = useProcessStore((s) => s.deleteSelectedProcess); // falls benötigt
  const sortKey = useProcessStore((s) => s.sortKey);

  const { loadTasksForProcess } = useTaskStore();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // lade Prozesse beim Mount
  useEffect(() => {
    loadProcesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedProcesses = useMemo(() => {
    if (!processes) return [];

    const key = sortKey;

    return [...processes].sort((a, b) => {
      switch (key) {
        case "STATUS": {
          const order = { ARCHIVED: 3, DONE: 2, OPEN: 1, IN_PROGRESS: 0 };
          return order[a.status] - order[b.status];
        }
        case "DUE_DATE_ASC":
          return (a.dueDate || "").localeCompare(b.dueDate || "");
        case "DUE_DATE_DESC":
          return (b.dueDate || "").localeCompare(a.dueDate || "");
        case "CREATOR_ASC":
          return a.creator.localeCompare(b.creator);
        case "CREATOR_DESC":
          return b.creator.localeCompare(a.creator);
        case "CREATED_AT_DESC":
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        default:
          return 0;
      }
    });
  }, [processes, sortKey]);

  // scroll to bottom wenn sich Anzahl ändert
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [sortedProcesses.length]);

  // Schließen bei Klick außerhalb / Scroll
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

  if (!sortedProcesses || sortedProcesses.length === 0) {
    return (
      <div style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader loading={true} size={36} message="Prozesse werden geladen…" />
      </div>
    );
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
