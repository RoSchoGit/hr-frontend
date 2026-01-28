import React, { useEffect, useRef, useMemo, useState } from "react";
import type { Process } from "@/features/process/Process";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useNavigate } from "react-router-dom";
import ProcessCard from "@/features/process/components/ProcessCard";
import Loader from "@/components/Loader";
import DeleteProcessConfirmModal from "./DeleteProcessConfirmModal";
import TemplateCard from "@/components/TemplateCard";
import "./ProcessListPage.css";

const NAV_HEIGHT_PX = 64;
const CARD_HEIGHT_PX = 64;
const GAP_PX = 8;
const MIN_VISIBLE = 0;

const ProcessListPage: React.FC = () => {
  const processes = useProcessStore((s) => s.processes);
  const setDeleteCandidate = useProcessStore((s) => s.setDeleteCandidate);
  const loadProcesses = useProcessStore((s) => s.loadProcesses);
  const selectProcess = useProcessStore((s) => s.selectProcess);
  const sortKey = useProcessStore((s) => s.sortKey);

  const { loadTasksForProcess } = useTaskStore();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [dynamicPlaceholders, setDynamicPlaceholders] = useState(0);

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  const sortedProcesses = useMemo(() => {
    if (!processes || processes.length === 0) return [];

    const arr = [...processes].sort((a, b) => {
      switch (sortKey) {
        case "STATUS": {
          const order: Record<string, number> = {
            ARCHIVED: 3,
            DONE: 2,
            OPEN: 1,
            IN_PROGRESS: 0,
          };
          return (order[a.status] ?? 0) - (order[b.status] ?? 0);
        }
        case "DUE_DATE_ASC":
          return (a.dueDate || "").localeCompare(b.dueDate || "");
        case "DUE_DATE_DESC":
          return (b.dueDate || "").localeCompare(a.dueDate || "");
        case "CREATOR_ASC":
          return (a.creator || "").localeCompare(b.creator || "");
        case "CREATOR_DESC":
          return (b.creator || "").localeCompare(a.creator || "");
        case "CREATED_AT_DESC":
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        default:
          return 0;
      }
    });

    return arr.reverse();
  }, [processes, sortKey]);

  useEffect(() => {
    const compute = () => {
      const usable = Math.max(0, window.innerHeight - NAV_HEIGHT_PX);
      const slots = Math.floor((usable + GAP_PX) / (CARD_HEIGHT_PX + GAP_PX));
      const need = Math.max(0, slots - sortedProcesses.length);
      const minNeeded = Math.max(0, MIN_VISIBLE - sortedProcesses.length);
      setDynamicPlaceholders(Math.max(need, minNeeded));
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [sortedProcesses.length]);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("scroll", close, true);
    };
  }, []);

  const handleProcessClick = async (process: Process) => {
    await loadTasksForProcess(process.id);
    selectProcess(process);
    navigate(`${process.id}/tasks`);
  };

  if (processes === undefined) {
    return (
      <div className="process-list__loading">
        <Loader loading size={36} message="Prozesse werden geladen…" />
      </div>
    );
  }

  const placeholderItems = Array.from({ length: dynamicPlaceholders }).map((_, i) =>
    i === 0 ? (
      <TemplateCard
        key="ph-cta"
        minHeightPx={CARD_HEIGHT_PX}
        variant={sortedProcesses.length === 0 ? "muted" : "default"}
        title={<div style={{ fontWeight: 600 }}>Neuen Prozess erstellen</div>}
        subtitle="Schnell starten mit einer Vorlage"
        showCTA
        ctaLabel="Neu"
        onCTAClick={() => navigate("/processes/create/step-1")}
      />
    ) : (
      <TemplateCard key={`ph-${i}`} minHeightPx={CARD_HEIGHT_PX} variant="skeleton" />
    )
  );

  return (
    <div className="process-list">
      {dynamicPlaceholders > 0 && (
        <div className="process-list__placeholders">
          {placeholderItems.map((el, i) => (
            <div key={i} className="process-list__placeholder-item">
              {el}
            </div>
          ))}
        </div>
      )}

      <div ref={listRef} className="process-list__scroll">
        {sortedProcesses.length === 0 && (
          <div className="process-list__empty">
            Keine Prozesse vorhanden. Starte mit einer Vorlage oder erstelle manuell.
          </div>
        )}

        {sortedProcesses.map((process, idx) => (
          <div
            key={process.id}
            className="process-list__item"
            {...(idx === sortedProcesses.length - 1 ? { "data-last-item": "true" } : {})}
          >
            <ProcessCard
              process={process}
              handleClick={handleProcessClick}
              onDelete={setDeleteCandidate}
              menuOpen={openMenuId === process.id}
              setMenuOpen={(open) => setOpenMenuId(open ? process.id : null)}
              onEdit={() => navigate(`/processes/${process.id}/edit`)}
              onInfo={() => navigate(`/processes/${process.id}`)}
            />
          </div>
        ))}

        <DeleteProcessConfirmModal />
      </div>
    </div>
  );
};

export default ProcessListPage;
