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
    if (processId) {
      navigate(`/processes/${processId}/task/${taskId}`);
    } else {
      let proId = useProcessStore.getState().selectedProcess?.id;
      navigate(`/processes/${proId}/task/${taskId}`);
    }
  };

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

  // Mit Drag & Drop
  if (showReorderButtons && (setTasks || onMoveTask)) {
    return (
      <>
        <Header title={processName} />
        <DndContext collisionDetection={closestCenter} onDragEnd={(handleDragEnd)}>
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1 py-1">
              {tasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  setDeleteCandidate={setDeleteCandidate}
                  showReorderButtons={showReorderButtons}
                  allowEditing={allowEditing}
                  menuOpen={openMenuTaskId === task.id}
                  setMenuOpen={(open) =>
                    setOpenMenuTaskId(open ? task.id : null)
                  }
                  onClick={() => handleClickTask(task.id)} // Navigation im Drag&Drop-Modus
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </>
    );
  }

  // Ohne Drag & Drop
  return (
    <>
      <Header title={processName} />
      <div className="flex flex-col gap-1 py-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            setDeleteCandidate={setDeleteCandidate}
            showReorderButtons={false}
            allowEditing={allowEditing}
            onClick={() => handleClickTask(task.id)} // Navigation im Normalmodus
            menuOpen={openMenuTaskId === task.id}
            setMenuOpen={(open: boolean) => setOpenMenuTaskId(open ? task.id : null)}
          />
        ))}
      </div>
    </>
  );
};

export default TaskList;
