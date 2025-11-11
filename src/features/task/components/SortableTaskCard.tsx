import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { BaseCard } from "@/components/BaseCard";
import EntityCardContent from "./EntityCardContent";
import type { Task } from "../Task";

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
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
      className="p-1 hover:text-text cursor-grab"
      aria-label="Aufgabe verschieben"
    >
      <GripVertical size={16} />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style} data-task-id={task.id}>
      <BaseCard
        title={task.title}
        meta={task}
        onClick={() => onClick?.(task.id)}
        onEdit={() => onEdit?.(task.id)}
        onDelete={() => setDeleteCandidate?.(task)}
        onInfo={() => onInfo?.(task.id)}
        showDragHandle={true}
        dragHandle={dragHandle}
        allowEditing={true}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        <EntityCardContent entity={task} />
      </BaseCard>
    </div>
  );
}
