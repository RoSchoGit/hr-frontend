import React, { useState, useEffect, useRef } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import type { Task } from "@/features/task/Task";
import SortableTaskCard from "./SortableTaskCard";
import TaskCard from "./TaskCard";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";
import DeleteTaskConfirmModal from "@/pages/task/DeleteTaskConfirmModal";
import "./TaskList.css";

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    if (setTasks) {
      setTasks((current) => arrayMove(current, oldIndex, newIndex));
    } else if (onMoveTask) {
      onMoveTask(oldIndex, newIndex);
    }
  };

  if (!tasks.length) {
    return (
      <div className="task-list">
        <div className="task-list__empty">
          <h3>Keine Tasks vorhanden</h3>
          <p>Leider existieren noch keine Tasks für diesen Prozess. Füge über das Formular unten neue Tasks hinzu.</p>
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
      <div className="task-list" ref={listRef}>
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
