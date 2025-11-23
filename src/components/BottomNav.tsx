import { User, Settings, ArrowLeft, Plus, List, ArrowDownAZ, Calendar, UserCheck, Clock, Check } from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import type { Task } from "@/features/task/Task";
import { useState, useRef, useEffect, useCallback } from "react";

// Helper functions that use getState() are fine when only called in event handlers:
export const getProcessById = (id: string) => {
  const store = useProcessStore.getState();
  return store.processes.find((p) => p.id === id) ?? null;
};

export const getTasksByProcessId = (processId: string): Task[] => {
  return useTaskStore.getState().getTasksForProcess(processId);
};

const SORT_OPTIONS = [
  { key: "STATUS" as const, label: "Status", Icon: UserCheck },
  { key: "DUE_DATE_ASC" as const, label: "Fälligkeitsdatum ↑", Icon: Calendar },
  { key: "DUE_DATE_DESC" as const, label: "Fälligkeitsdatum ↓", Icon: Calendar },
  { key: "CREATOR_ASC" as const, label: "Ersteller ↑", Icon: UserCheck },
  { key: "CREATOR_DESC" as const, label: "Ersteller ↓", Icon: UserCheck },
  { key: "CREATED_AT_DESC" as const, label: "Neueste zuerst", Icon: Clock },
] as const;

type SortKeyType = typeof SORT_OPTIONS[number]["key"];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { processId, taskId } = useParams();
  const pathname = location.pathname;

  const showBackButton = pathname !== "/processes";
  const isOnProcessList = pathname === "/processes" || pathname === "/processes/";
  const isOnTaskList = pathname === `/processes/${processId}/tasks` && !taskId;

  // **Wichtig:** separate Selektoren (keine Objekt-Literal-Rückgabe)
  const sortKey = useProcessStore((s) => s.sortKey);
  const setSortKey = useProcessStore((s) => s.setSortKey);

  // useTaskStore getters (statt komplettes object)
  const setTasks = useTaskStore((s) => s.setTasks);

  // handlers in useCallback => stabilere Referenzen
  const handlePlusClick = useCallback(() => {
    if (isOnProcessList) {
      navigate("/processes/create/step-1");
      return;
    }

    if (isOnTaskList && processId) {
      // process + tasks nur beim Klick laden (nicht während Render)
      const process = getProcessById(processId);
      const tasks = getTasksByProcessId(processId);

      // set tasks and select process using getState() – beide sind side-effects on demand
      useTaskStore.getState().setTasks(tasks);
      useProcessStore.getState().selectProcess(process);

      navigate("/processes/" + processId + "/tasks-edit");
    }
  }, [isOnProcessList, isOnTaskList, navigate, processId]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Sort Dropdown state + outside click handling
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
    setSortKey(key as any); // keep as-is to match your store type if needed
    setOpenSort(false);
  }, [setSortKey]);

  return (
    <footer className="h-10 flex items-center justify-between px-4 bg-indigo-100 relative">
      <div className="flex flex-1">
        <div className="flex w-full max-w-50 justify-between items-center">
          <NavLink to="/processes" className="flex flex-col items-center text-sm">
            <List className="h-6 w-6" />
          </NavLink>
          <NavLink to="/settings" className="flex flex-col items-center text-sm">
            <Settings className="h-6 w-6" />
          </NavLink>
          <NavLink to="/profile" className="flex flex-col items-center text-sm">
            <User className="h-6 w-6" />
          </NavLink>

          {(isOnProcessList || isOnTaskList) && (
            <button
              onClick={handlePlusClick}
              className="text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}

          {isOnProcessList && (
            <div ref={sortRef} className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setOpenSort((v) => !v); }}
                className="flex items-center p-1 rounded"
                aria-haspopup="true"
                aria-expanded={openSort}
                title="Sortierung"
              >
                <ArrowDownAZ className="h-6 w-6" style={{ color: "#000000", strokeWidth: 2 }} stroke="currentColor" />
              </button>

              {openSort && (
                <div
                  className="fixed bottom-14 right-4 z-50 rounded-2xl"
                  role="menu"
                  aria-label="Sortieroptionen"
                  style={{
                    width: "min(92vw, 32rem)",    // bevorzugte Breite jetzt doppelt so groß (responsive)
                    maxWidth: "16rem",
                    backgroundColor: "#ffffff",   // forced opaque white (bg-surface)
                    border: "1px solid #e2e8f0",  // forced border color (border-border)
                    boxShadow: "0 10px 20px rgba(2,6,23,0.08)",
                    padding: "0.25rem",
                    pointerEvents: "auto",
                  }}
                >
                  <div>
                    {SORT_OPTIONS.map((opt) => {
                      const Icon = opt.Icon;
                      const selected = sortKey === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={(e) => { e.stopPropagation(); onSelectSort(opt.key); }}
                          onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f1f5f9"; }}
                          onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                          role="menuitem"
                          aria-pressed={selected}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.65rem 0.9rem",
                            width: "100%",
                            backgroundColor: selected ? "rgba(37,99,235,0.08)" : "transparent",
                            color: selected ? "#2563eb" : "#0f172a",
                            borderRadius: "0.5rem",
                            textAlign: "left",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          <Icon
                            style={{
                              width: 20,
                              height: 20,
                              color: "#000000",   // ICONS BLACK
                              strokeWidth: 2,
                              flexShrink: 0,
                            }}
                            stroke="currentColor"
                          />
                          <span style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: selected ? "#2563eb" : "#0f172a",
                            fontWeight: selected ? 600 : 400,
                            marginRight: "0.5rem",
                          }}>
                            {opt.label}
                          </span>

                          {selected && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ flexShrink: 0, color: "#2563eb" }}
                              aria-hidden
                            >
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="flex items-center flex-shrink-0 ml-2">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="text-text hover:text-black"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
      </div>
    </footer>
  );
};

export default BottomNav;
