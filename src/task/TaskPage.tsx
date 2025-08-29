import { useParams } from "react-router-dom";
import { useTaskStore } from "./useTaskStore";
import { useProcessStore } from "@/process/useProcessStore";
import Header from "@/components/Header";

const TaskPage = () => {
  const { taskId } = useParams();
  const { getTaskById } = useTaskStore();
  const task = getTaskById(taskId);

  const processName = useProcessStore.getState().selectedProcess?.title;

  if (!task) {
    return <div className="p-4 text-red-500">Task nicht gefunden.</div>;
  }

  return (
    <>
      <Header title={processName} />
      <div className="p-4 max-w-3xl mx-auto flex flex-col gap-4">
        {/* Pflichtfelder */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <p className="font-semibold text-gray-700">Typ:</p>
            <p className="text-gray-800">{task.type}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <p className="font-semibold text-gray-700">Status:</p>
            <p className="text-gray-800">{task.status}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-700">Beschreibung:</p>
            <p className="text-gray-800">{task.description || "Keine Beschreibung vorhanden."}</p>
          </div>
        </div>

        {/* Zusätzliche Felder */}
        {task.metadata && Object.keys(task.metadata).length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Zusätzliche Felder</h2>
            {Object.entries(task.metadata).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-gray-200 pb-1"
              >
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TaskPage;
