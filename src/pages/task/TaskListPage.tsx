import { useEffect } from "react";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import TaskList from "@/features/task/components/TaskList";
import EmptyState from "@/components/EmptyState";
import { useOutletContext } from "react-router-dom";
import type { ProcessContextType } from "@/pages/process/ProcessLayout";

const TaskListPage = () => {
  const { loadProcesses } = useProcessStore();
  const { loadTasksForProcess, getTasksForProcess } = useTaskStore();
  const { process } = useOutletContext<ProcessContextType>();

  useEffect(() => {
    if (process?.id) {
      loadTasksForProcess(process.id);
    }
  }, [loadProcesses, loadTasksForProcess]);

  const tasks = getTasksForProcess(process?.id);

  if (!process) {
    return (
      <EmptyState
        title="Prozess nicht gefunden"
        message="Der angeforderte Prozess existiert nicht oder wurde gelöscht."
      />
    );
  }

  return (
      <TaskList
        tasks={tasks}
      />
  );
};

export default TaskListPage;
