import React, { useEffect, useMemo, useRef, useState } from "react";
import { List } from "lucide-react";
import type { Process } from "@/features/process/Process";
import "./ProcessSorter.css";

export type SortKey =
  | "STATUS"
  | "DUE_DATE_ASC"
  | "DUE_DATE_DESC"
  | "CREATOR_ASC"
  | "CREATOR_DESC"
  | "CREATED_AT_DESC";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "STATUS", label: "Status (Standard)" },
  { key: "DUE_DATE_ASC", label: "Ablaufdatum ↑" },
  { key: "DUE_DATE_DESC", label: "Ablaufdatum ↓" },
  { key: "CREATOR_ASC", label: "Ersteller A→Z" },
  { key: "CREATOR_DESC", label: "Ersteller Z→A" },
  { key: "CREATED_AT_DESC", label: "Neueste zuerst" },
];

const DEFAULT_KEY: SortKey = "STATUS";
const STORAGE_KEY = "process_sort_key_v1";

const STATUS_ORDER: Record<Process["status"], number> = {
  IN_PROGRESS: 0,
  OPEN: 1,
  DONE: 2,
  ARCHIVED: 3,
};

const parseDateSafe = (s?: string | null) => {
  if (!s) return 0;
  const t = Date.parse(s);
  return isNaN(t) ? 0 : t;
};

const compareStrings = (a?: string | null, b?: string | null) =>
  ((a ?? "").toLowerCase()).localeCompare((b ?? "").toLowerCase());

type Props = {
  processes: Process[] | undefined;
  children: (sortedProcesses: Process[]) => React.ReactNode;
  listRef?: React.RefObject<HTMLElement>;
  persist?: boolean;
  className?: string;
  showLabel?: boolean;
  autoScroll?: boolean;
};

export const ProcessSorter: React.FC<Props> = ({
  processes,
  children,
  listRef,
  persist = true,
  className = "",
  showLabel = false,
  autoScroll = true,
}) => {
  const [open, setOpen] = useState(false);

  const initial: SortKey = (() => {
    if (!persist) return DEFAULT_KEY;
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v) return v as SortKey;
    } catch {
      /* ignore */
    }
    return DEFAULT_KEY;
  })();

  const [sortKey, setSortKey] = useState<SortKey>(initial);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(STORAGE_KEY, sortKey);
    } catch {
      /* ignore */
    }
  }, [sortKey, persist]);

  const sortedProcesses = useMemo(() => {
    const items = [...(processes ?? [])];

    switch (sortKey) {
      case "STATUS":
        return items.sort((a, b) => {
          const oa = STATUS_ORDER[a.status] ?? 999;
          const ob = STATUS_ORDER[b.status] ?? 999;
          if (oa === ob) return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
          return oa - ob;
        });

      case "DUE_DATE_ASC":
        return items.sort((a, b) => {
          const ta = parseDateSafe(a.dueDate);
          const tb = parseDateSafe(b.dueDate);
          if (ta === tb) return compareStrings(a.title, b.title);
          if (ta === 0) return 1;
          if (tb === 0) return -1;
          return ta - tb;
        });

      case "DUE_DATE_DESC":
        return items.sort((a, b) => {
          const ta = parseDateSafe(a.dueDate);
          const tb = parseDateSafe(b.dueDate);
          if (ta === tb) return compareStrings(a.title, b.title);
          if (ta === 0) return 1;
          if (tb === 0) return -1;
          return tb - ta;
        });

      case "CREATOR_ASC":
        return items.sort(
          (a, b) =>
            compareStrings(a.creator, b.creator) ||
            compareStrings(a.title, b.title)
        );

      case "CREATOR_DESC":
        return items.sort(
          (a, b) =>
            compareStrings(b.creator, a.creator) ||
            compareStrings(a.title, b.title)
        );

      case "CREATED_AT_DESC":
        return items.sort((a, b) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
        );

      default:
        return items;
    }
  }, [processes, sortKey]);

  useEffect(() => {
    if (!autoScroll || !listRef?.current) return;
    const el = listRef.current;
    el.scrollTop = el.scrollHeight;
  }, [sortedProcesses.length, autoScroll, listRef]);

  const selectRef = useRef<HTMLSelectElement | null>(null);
  const openAndFocus = () => {
    setOpen(true);
    setTimeout(() => selectRef.current?.focus(), 0);
  };

  return (
    <div className={`process-sorter ${className}`}>
      <button
        type="button"
        onClick={openAndFocus}
        title="Sortieren"
        className="process-sorter__button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <List className="process-sorter__icon" />
        {showLabel && (
          <span className="process-sorter__label">
            {SORT_OPTIONS.find((s) => s.key === sortKey)?.label}
          </span>
        )}
      </button>

      {open && (
        <select
          ref={selectRef}
          value={sortKey}
          onChange={(e) => {
            setSortKey(e.target.value as SortKey);
            setOpen(false);
          }}
          onBlur={() => setOpen(false)}
          className="process-sorter__select"
          aria-label="Sortieroptionen"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {children(sortedProcesses)}
    </div>
  );
};

export default ProcessSorter;
