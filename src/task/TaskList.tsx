import React, { useState, useEffect } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { Task } from "@/task/Task";
import SortableTaskCard from "./SortableTaskCard";
import TaskCard from "./TaskCard";
import { useNavigate, useParams } from "react-router-dom";
import { useProcessStore } from "@/process/useProcessStore";
import Header from "@/components/Header";
import { useRef } from "react";

type TaskListProps = {
  processName: string;
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  setDeleteCandidate?: (task: Task) => void;
  showReorderButtons?: boolean;
  allowEditing?: boolean;
  onMoveTask?: (index: number, direction: number) => void;
};

const TaskList = ({
  processName,
  tasks,
  setTasks,
  setDeleteCandidate,
  showReorderButtons,
  allowEditing = false,
  onMoveTask,
}: TaskListProps) => {
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { processId } = useParams<{ processId: string }>();

  // Handler für Navigation
  const handleClickTask = (taskId: string) => {
    const proId = processId || useProcessStore.getState().selectedProcess?.id;
    if (proId) navigate(`/processes/${proId}/task/${taskId}`);
  };

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [tasks.length]);

  // Schließen bei Klick außerhalb
  useEffect(() => {
    const closeMenu = () => setOpenMenuTaskId(null);
    document.addEventListener("click", closeMenu);
    document.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    if (setTasks) {
      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
    } else if (onMoveTask) {
      const direction = newIndex > oldIndex ? 1 : -1;
      onMoveTask(oldIndex, direction);
    }
  };

  if (tasks.length === 0) {
    return (
      <>
        <Header title={processName} />
        <div className="p-4 sm:p-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 sm:p-6 text-center shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Keine Tasks vorhanden</h3>
            <p className="text-sm sm:text-base">
              Leider existieren noch keine Tasks für diesen Prozess.
              Füge über das Formular unten neue Tasks hinzu.
            </p>
          </div>
        </div>
      </>
    );
  }

  const renderTaskCards = () =>
    tasks.map((task) => (
      <div key={task.id} className="w-full">
        {showReorderButtons && (setTasks || onMoveTask) ? (
          <SortableTaskCard
            key={task.id}
            task={task}
            showReorderButtons
            allowEditing={allowEditing}
            setDeleteCandidate={setDeleteCandidate}
            menuOpen={openMenuTaskId === task.id}
            setMenuOpen={(open) => setOpenMenuTaskId(open ? task.id : null)}
            onClick={() => handleClickTask(task.id)}
          />
        ) : (
          <TaskCard
            key={task.id}
            task={task}
            allowEditing={allowEditing}
            setDeleteCandidate={setDeleteCandidate}
            menuOpen={openMenuTaskId === task.id}
            setMenuOpen={(open) => setOpenMenuTaskId(open ? task.id : null)}
            onClick={() => handleClickTask(task.id)}
          />
        )}
      </div>
    ));

  return (
    <>
      <Header title={processName} />

      {/* Nur hier geändert: gap-2 statt gap-3 */}
      <div className="flex flex-col gap-2 py-2 px-2 sm:px-4">
        {showReorderButtons && (setTasks || onMoveTask) ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {renderTaskCards()}
            </SortableContext>
          </DndContext>
        ) : (
          renderTaskCards()
        )}
      </div>
    </>
  );
};

export default TaskList;
