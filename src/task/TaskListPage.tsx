// src/task/TaskListPage.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/task/useTaskStore";
import { useProcessStore } from "@/process/useProcessStore";
import TaskList from "@/task/TaskList";

const TaskListPage = () => {
  const { processId } = useParams<{ processId: string }>();
  const { processes } = useProcessStore();

  const { loadTasksForProcess, getTasksForProcess, deleteCandidate } = useTaskStore();

  useEffect(() => {
    if (processId) {
      loadTasksForProcess(processId); // lädt nur, wenn noch nicht geladen
    }
  }, [processId, loadTasksForProcess]);

  const tasks = getTasksForProcess(processId);

  const process = processes.find((p) => p.id === processId);

  useEffect(() => {
    if (process?.tasks) {
      loadTasksForProcess(process.id);

    }
  }, [process?.tasks]);

  if (!process) {
    return <div className="p-4">Prozess nicht gefunden.</div>;
  }

  return (
    <>
      <TaskList
        processName={process.title}
        tasks={tasks}
        allowEditing={false}
        showReorderButtons={false}
      />

      {deleteCandidate && (
        /* Dein Delete-Modal hier (wie vorher). */
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Task löschen?</h2>
            <p className="mb-4">
              Möchtest du <strong>{deleteCandidate.title}</strong> wirklich löschen?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => null} //setDeleteCandidate(null)}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  // Beispiel: removeTask im Store aufrufen
                  // useTaskStore.getState().removeTask(deleteCandidate.id)
                  // und anschließend
                  // setDeleteCandidate(null);
                }}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskListPage;
