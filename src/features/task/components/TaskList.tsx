import React, { useState, useEffect, useRef } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { Task } from "@/features/task/Task";
import SortableTaskCard from "./SortableTaskCard";
import TaskCard from "./TaskCard";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";
import DeleteTaskConfirmModal from "@/pages/task/DeleteTaskConfirmModal";

type TaskListProps = {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  onMoveTask?: (oldIndex: number, newIndex: number) => void;
};

const TaskList = ({ tasks = [], setTasks, onMoveTask }: TaskListProps) => {
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { processId } = useParams<{ processId: string }>();
  const listRef = useRef<HTMLDivElement>(null);
  const { setDeleteCandidate } = useTaskStore();
  const itemIds = tasks.map(t => String(t.id));

  const handleClickTask = (taskId: string) => {
    if (!processId) return;
    navigate(`/processes/${processId}/task/${taskId}`);
  };

  const handleEditTask = (taskId: string) => {
    navigate(`/processes/${processId}/task-edit/${taskId}`);
  };

  const handleInfoTask = (taskId: string) => {
    navigate(`/processes/${processId}/task/${taskId}`);
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [tasks.length]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuTaskId(null);
    document.addEventListener("click", closeMenu);
    document.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  // --- in TaskList.tsx: handleDragEnd ersetzen ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      console.warn("DragEnd: index not found", { active: active.id, over: over.id });
      return;
    }

    if (setTasks) {
      setTasks((current) => arrayMove(current, oldIndex, newIndex));
    } else if (onMoveTask) {
      // <-- hier: übergebe newIndex (nicht direction)
      onMoveTask(oldIndex, newIndex);
    }
  };

  if (!tasks.length) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 sm:p-6 text-center shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Keine Tasks vorhanden</h3>
          <p className="text-sm sm:text-base">
            Leider existieren noch keine Tasks für diesen Prozess.
            Füge über das Formular unten neue Tasks hinzu.
          </p>
        </div>
      </div>
    );
  }

  const renderTaskCards = () =>
    tasks.map((task) =>
      (setTasks || onMoveTask) ? (
        <SortableTaskCard
          key={task.id}
          task={task}
          setDeleteCandidate={setDeleteCandidate}
          menuOpen={openMenuTaskId === task.id}
          setMenuOpen={(open) => setOpenMenuTaskId(open ? task.id : null)}
          onClick={() => handleClickTask(task.id)}
          onEdit={() => handleEditTask(task.id)}
          onInfo={() => handleInfoTask(task.id)}
        />
      ) : (
        <TaskCard
          key={task.id}
          task={task}
          menuOpen={openMenuTaskId === task.id}
          setMenuOpen={(open: boolean) => setOpenMenuTaskId(open ? task.id : null)}
          onClick={() => handleClickTask(task.id)}
        />
      )
    );

  return (
    <>
      <div className="flex flex-col gap-2 py-2 px-2 sm:px-4" ref={listRef}>
        {(setTasks || onMoveTask) ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {renderTaskCards()}
            </SortableContext>
          </DndContext>
        ) : (
          renderTaskCards()
        )}
      </div>
      <DeleteTaskConfirmModal />
    </>
  );
};

export default TaskList;
