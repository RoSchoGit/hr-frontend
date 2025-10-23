// src/task/TaskListPage.tsx
import { useEffect } from "react";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import TaskList from "@/features/task/components/TaskList";
import EmptyState from "@/components/EmptyState";
import { useOutletContext } from "react-router-dom";
import type { ProcessContextType } from "@/pages/process/ProcessLayout";

const TaskListPage = () => {
  const { loadProcesses } = useProcessStore();
  const { loadTasksForProcess, getTasksForProcess, deleteCandidate, deleteSelectedTask, setDeleteCandidate } = useTaskStore();
  const { process } = useOutletContext<ProcessContextType>();

  // Minimal: immer neu laden (kein Check)
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
    <>
      <TaskList
        tasks={tasks}
        showReorderButtons={false}
        setDeleteCandidate={setDeleteCandidate}
      />

      {deleteCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Task löschen?</h2>
            <p className="mb-4">
              Möchtest du <strong>{deleteCandidate.title}</strong> wirklich löschen?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteCandidate(null)}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={deleteSelectedTask}
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
