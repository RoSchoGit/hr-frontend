import { useParams } from "react-router-dom";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import Header from "@/components/Header";
import SmartText from "@/components/SmartText";

const TaskPage = () => {
  const { taskId } = useParams();
  const { getTaskById } = useTaskStore();
  const task = getTaskById(taskId);

  const processName = useProcessStore.getState().selectedProcess?.title;

  if (!task) {
    return (
      <div className="p-4 text-red-500">
        <SmartText>Task nicht gefunden.</SmartText>
      </div>
    );
  }

  return (
    <>
      <Header
        title={
          processName ? (
            <SmartText variant="small" className="truncate">
              {processName}
            </SmartText>
          ) : undefined
        }
      />
      <div className="p-4 max-w-3xl mx-auto flex flex-col gap-4">
        {/* Pflichtfelder */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
          <h1 className="text-2xl font-bold">
            <SmartText>{task.title}</SmartText>
          </h1>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <SmartText className="font-semibold text-gray-700">Typ:</SmartText>
            <SmartText className="text-gray-800">{task.type}</SmartText>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <SmartText className="font-semibold text-gray-700">Status:</SmartText>
            <SmartText className="text-gray-800">{task.status}</SmartText>
          </div>

          <div className="flex flex-col">
            <SmartText className="font-semibold text-gray-700">Beschreibung:</SmartText>
            <SmartText className="text-gray-800">
              {task.description || "Keine Beschreibung vorhanden."}
            </SmartText>
          </div>
        </div>

        {/* Zusätzliche Felder */}
        {task.metadata && Object.keys(task.metadata).length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              <SmartText>Zusätzliche Felder</SmartText>
            </h2>
            {Object.entries(task.metadata).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-gray-200 pb-1"
              >
                <SmartText className="font-semibold text-gray-700">{key}:</SmartText>
                <SmartText className="text-gray-800">{value}</SmartText>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TaskPage;
