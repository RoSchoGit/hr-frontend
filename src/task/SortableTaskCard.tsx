import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { GripVertical } from "lucide-react";
import type { Task } from "./Task";

type SortableTaskCardProps = {
  task: Task;
  setDeleteCandidate?: (task: Task) => void;
  showReorderButtons?: boolean;
  allowEditing?: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onClick: () => void;
};

const SortableTaskCard = ({
  task,
  setDeleteCandidate,
  showReorderButtons = false,
  allowEditing = false,
  menuOpen,
  setMenuOpen,
  onClick,
}: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        setDeleteCandidate={setDeleteCandidate}
        showReorderButtons={showReorderButtons}
        allowEditing={allowEditing}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onClick={onClick} // Navigation bleibt hier ganz normal
        dragHandle={
          showReorderButtons ? (
            <button
              type="button"
              {...attributes} // nur am Handle!
              {...listeners}  // nur am Handle!
              onClick={(e) => e.stopPropagation()} // verhindert Navigation beim Handle-Klick
              className="p-1 hover:text-gray-700 cursor-grab"
              aria-label="Aufgabe verschieben"
            >
              <GripVertical size={16} />
            </button>
          ) : undefined
        }
      />
    </div>
  );
};

export default SortableTaskCard;
