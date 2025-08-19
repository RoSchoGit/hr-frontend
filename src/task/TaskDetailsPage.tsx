import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTaskStore } from "./useTaskStore";
import { useProcessStore } from "@/process/useProcessStore";
import Header from "@/components/Header";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const { tasks, loadTasks } = useTaskStore();
  const processName = useProcessStore.getState().selectedProcess?.title;

  useEffect(() => {
    if (tasks.length === 0) {
      loadTasks(); // Falls Tasks noch nicht geladen sind
    }
  }, [tasks.length, loadTasks]);

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return <div className="p-4 text-red-500">Task nicht gefunden.</div>;
  }

  return (
    <>
      <Header title={processName} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
        <p className="text-gray-600 mb-2">Typ: {task.type}</p>
        <p className="text-gray-600 mb-2">Status: {task.status}</p>
        <p className="text-gray-600">{task.description || "Keine Beschreibung vorhanden."}</p>
      </div>
    </>
  );
};

export default TaskDetailsPage;
