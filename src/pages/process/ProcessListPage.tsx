import React, { useEffect, useRef, useMemo, useState } from "react";
import type { Process } from "@/features/process/Process";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useNavigate } from "react-router-dom";
import ProcessCard from "@/features/process/components/ProcessCard";
import Loader from "@/components/Loader";
import DeleteProcessConfirmModal from "./DeleteProcessConfirmModal";
import TemplateCard from "@/components/TemplateCard";

const NAV_HEIGHT_PX = 64; // Footer/BottomNav Höhe (anpassen falls nötig)
const CARD_HEIGHT_PX = 64; // Höhe einer Card inkl. innerer Abstände (anpassen falls nötig)
const GAP_PX = 8; // gap-2 in Tailwind = 8px
const MIN_VISIBLE = 0; // optional: mindestens so viele sichtbare Items (inkl. Prozesse)

const ProcessListPage: React.FC = () => {
  // Prozesse aus Store (kann [] oder null/undefined sein)
  const processes = useProcessStore((s) => s.processes);
  const setDeleteCandidate = useProcessStore((s) => s.setDeleteCandidate);
  const loadProcesses = useProcessStore((s) => s.loadProcesses);
  const selectProcess = useProcessStore((s) => s.selectProcess);
  const sortKey = useProcessStore((s) => s.sortKey);

  const { loadTasksForProcess } = useTaskStore();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // dynamische Anzahl Platzhalter, berechnet aus viewport-height
  const [dynamicPlaceholders, setDynamicPlaceholders] = useState<number>(0);

  // lade Prozesse einmalig
  useEffect(() => {
    loadProcesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sortieren (memo)
  const sortedProcesses = useMemo(() => {
    if (!processes || processes.length === 0) return [];

    const key = sortKey;
    const arr = [...processes].sort((a, b) => {
      switch (key) {
        case "STATUS": {
          const order: Record<string, number> = { ARCHIVED: 3, DONE: 2, OPEN: 1, IN_PROGRESS: 0 };
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

    // "chat-like": älteste oben, neueste unten
    return arr.reverse();
  }, [processes, sortKey]);

  // Berechnung der Platzhalter via Viewport-Höhe
  useEffect(() => {
    const computePlaceholders = () => {
      // viewport Höhe
      const vh = window.innerHeight;
      // nutzbare Höhe: zieh Footer/BottomNav ab (keinen Header vorhanden)
      const usable = Math.max(0, vh - NAV_HEIGHT_PX);

      // slots = wie viele Cards inkl. gaps in usable passen
      const slots = Math.floor((usable + GAP_PX) / (CARD_HEIGHT_PX + GAP_PX));

      // berechne fehlende Platzhalter (wird *oben* gerendert)
      const need = Math.max(0, slots - sortedProcesses.length);

      // Optional: stell mindestens MIN_VISIBLE sichtbare Items sicher (inkl. Prozesse)
      const minNeeded = Math.max(0, MIN_VISIBLE - sortedProcesses.length);

      setDynamicPlaceholders(Math.max(need, minNeeded));
    };

    computePlaceholders();
    window.addEventListener("resize", computePlaceholders);
    return () => window.removeEventListener("resize", computePlaceholders);
  }, [sortedProcesses.length]);

  // schließen bei click outside / scroll
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

  const handleDeleteProcess = (process: Process) => {
    setDeleteCandidate(process);
  };

  const handleEditProcess = (process: Process) => {
    navigate(`/processes/${process.id}/edit`);
  };

  const handleInfoProcess = (process: Process) => {
    navigate(`/processes/${process.id}`);
  };

  // --- Rendering ---
  if (processes === undefined) {
    return (
      <div style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader loading={true} size={36} message="Prozesse werden geladen…" />
      </div>
    );
  }

  // Anzahl Platzhalter, die wir oben rendern (inkl. CTA-Template falls erstes)
  const placeholdersCount = dynamicPlaceholders;

  const placeholderItems = Array.from({ length: placeholdersCount }).map((_, i) => {
    if (i === 0) {
      return (
        <TemplateCard
          key={`ph-cta-${i}`}
          minHeightPx={CARD_HEIGHT_PX}
          variant={sortedProcesses.length === 0 ? "muted" : "default"}
          title={<div className="font-semibold">Neuen Prozess erstellen</div>}
          subtitle="Schnell starten mit einer Vorlage"
          showCTA
          ctaLabel="Neu"
          onCTAClick={() => navigate("/processes/create/step-1")}
        />
      );
    }
    return <TemplateCard key={`ph-${i}`} minHeightPx={CARD_HEIGHT_PX} variant="skeleton" />;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Platzhalter *oben* damit Prozesse unten bleiben (chat-like) */}
      {placeholdersCount > 0 && (
        <div className="p-2 sm:p-4 space-y-2">
          {placeholderItems.map((el, idx) => (
            <div key={`wrap-${idx}`} className="w-full">
              {el}
            </div>
          ))}
        </div>
      )}

      <div
        ref={listRef}
        className="flex flex-col flex-1 overflow-y-auto gap-2 p-2 sm:p-4"
        style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }} // Footer-Safearea
      >
        {sortedProcesses.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">Keine Prozesse vorhanden. Starte mit einer Vorlage oder erstelle manuell.</div>
        )}

        {sortedProcesses.map((process, idx) => {
          const isLast = idx === sortedProcesses.length - 1;
          return (
            <div key={process.id} className="w-full" {...(isLast ? { "data-last-item": "true" } : {})}>
              <ProcessCard
                process={process}
                handleClick={handleProcessClick}
                onDelete={handleDeleteProcess}
                menuOpen={openMenuId === process.id}
                setMenuOpen={(open: boolean) => setOpenMenuId(open ? process.id : null)}
                onEdit={handleEditProcess}
                onInfo={handleInfoProcess}
              />
            </div>
          );
        })}

        <DeleteProcessConfirmModal />
      </div>
    </div>
  );
};

export default ProcessListPage;
