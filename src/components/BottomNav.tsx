// src/components/BottomNav.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Settings,
  ArrowLeft,
  Plus,
  List,
  ArrowDownAZ,
  Calendar,
  UserCheck,
  Clock,
} from "lucide-react";

import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import type { Task } from "@/features/task/Task";

// --- small helpers that use getState (safe inside event handlers or top-level helpers) ---
export const getProcessById = (id: string) => {
  const store = useProcessStore.getState();
  return store.processes.find((p) => p.id === id) ?? null;
};
export const getTasksByProcessId = (processId: string): Task[] => {
  return useTaskStore.getState().getTasksForProcess(processId);
};

// --- sort options ---
const SORT_OPTIONS = [
  { key: "STATUS" as const, label: "Status", Icon: UserCheck },
  { key: "DUE_DATE_ASC" as const, label: "Fälligkeitsdatum ↑", Icon: Calendar },
  { key: "DUE_DATE_DESC" as const, label: "Fälligkeitsdatum ↓", Icon: Calendar },
  { key: "CREATOR_ASC" as const, label: "Ersteller ↑", Icon: UserCheck },
  { key: "CREATOR_DESC" as const, label: "Ersteller ↓", Icon: UserCheck },
  { key: "CREATED_AT_DESC" as const, label: "Neueste zuerst", Icon: Clock },
] as const;
type SortKeyType = typeof SORT_OPTIONS[number]["key"];

// --- BottomNav component ---
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { processId, taskId } = useParams();
  const pathname = location.pathname;

  // determine where we are
  const showBackButton = pathname !== "/processes";
  const isOnProcessList = pathname === "/processes" || pathname === "/processes/";
  const isOnTaskList = pathname === `/processes/${processId}/tasks` && !taskId;

  // store hooks
  const sortKey = useProcessStore((s) => s.sortKey);
  const setSortKey = useProcessStore((s) => s.setSortKey);

  // plus button behavior
  const handlePlusClick = useCallback(() => {
    if (isOnProcessList) {
      navigate("/processes/create/step-1");
      return;
    }

    if (isOnTaskList && processId) {
      const process = getProcessById(processId);
      const tasks = getTasksByProcessId(processId);

      // set tasks/select process on demand in stores
      useTaskStore.getState().setTasks(tasks);
      useProcessStore.getState().selectProcess(process);

      navigate("/processes/" + processId + "/tasks-edit");
    }
  }, [isOnProcessList, isOnTaskList, navigate, processId]);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  // Sort dropdown
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const onSelectSort = useCallback((key: SortKeyType) => {
    setSortKey(key as any);
    setOpenSort(false);
  }, [setSortKey]);

  return (
    <footer className="fixed inset-x-0 bottom-0 h-16 z-40 bg-indigo-100 border-t border-indigo-200">
      <div className="grid grid-cols-5 max-w-xl mx-auto h-full place-items-center px-3">

        {/* Slot 1: Processes */}
        <NavLink
          to="/processes"
          className="w-full flex items-center justify-center"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <List size={20} />
          </div>
          <span className="sr-only">Prozesse</span>
        </NavLink>

        {/* Slot 2: Settings */}
        <NavLink
          to="/settings"
          className="w-full flex items-center justify-center"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <Settings size={20} />
          </div>
          <span className="sr-only">Einstellungen</span>
        </NavLink>

        {/* Slot 3: Plus */}
        {(isOnProcessList || isOnTaskList) ? (
          <button
            onClick={handlePlusClick}
            aria-label="Neu anlegen"
            className="w-full flex items-center justify-center"
          >
            <div className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-blue-600 hover:text-blue-800">
              <Plus size={18} />
            </div>
          </button>
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="w-10 h-10" />
          </div>
        )}

        {/* Slot 4: Profile */}
        <NavLink
          to="/profile"
          className="w-full flex items-center justify-center"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <User size={20} />
          </div>
          <span className="sr-only">Profil</span>
        </NavLink>

        {/* Slot 5: Action (Sort ODER Back) */}
        <div
          ref={sortRef}
          className="w-full flex items-center justify-center relative"
        >
          {isOnProcessList ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSort((v) => !v);
                }}
                aria-haspopup="true"
                aria-expanded={openSort}
                aria-label="Sortierung"
                className="w-10 h-10 flex items-center justify-center"
              >
                <ArrowDownAZ size={20} />
              </button>

              {openSort && (
                <div
                  role="menu"
                  aria-label="Sortieroptionen"
                  className="fixed bottom-16 right-4 z-50 rounded-2xl bg-white border shadow-lg p-1"
                  style={{ width: "min(92vw, 20rem)" }}
                >
                  {SORT_OPTIONS.map((opt) => {
                    const Icon = opt.Icon;
                    const selected = sortKey === opt.key;

                    return (
                      <button
                        key={opt.key}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSort(opt.key);
                        }}
                        role="menuitem"
                        aria-pressed={selected}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-50"
                        style={{
                          backgroundColor: selected ? "rgba(37,99,235,0.06)" : "transparent",
                          color: selected ? "#2563eb" : "#0f172a",
                        }}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <span
                          className="flex-1 truncate"
                          style={{ fontWeight: selected ? 600 : 400 }}
                        >
                          {opt.label}
                        </span>

                        {selected && (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                            className="flex-shrink-0 text-blue-600"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : showBackButton ? (
            <button
              onClick={handleBack}
              aria-label="Zurück"
              className="w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </div>
    </footer>
  );
};

export default BottomNav;
