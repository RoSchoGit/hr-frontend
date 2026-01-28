import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Task } from "../Task";
import "./SortableTaskCard.css";
import EntityBaseCard from "@/components/EntityBaseCard";

type Props = {
  task: Task;
  setDeleteCandidate?: (task: Task) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onClick: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onInfo: (taskId: string) => void;
};

export default function SortableTaskCard({
  task,
  setDeleteCandidate,
  menuOpen,
  setMenuOpen,
  onClick,
  onEdit,
  onInfo,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: String(task.id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
      className="sortable-task-card__drag-handle"
      aria-label="Aufgabe verschieben"
    >
      <GripVertical size={16} />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-task-id={task.id}
      className={`sortable-task-card${isDragging ? " dragging" : ""}`}
    >
      <EntityBaseCard
        title={task.title}
        entity={task}
        onClick={() => onClick?.(task.id)}
        onEdit={() => onEdit?.(task.id)}
        onDelete={() => setDeleteCandidate?.(task)}
        onInfo={() => onInfo?.(task.id)}
        showDragHandle={true}
        dragHandle={dragHandle}
        allowEditing={true}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </div>
  );
}
