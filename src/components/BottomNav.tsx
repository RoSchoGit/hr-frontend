import { User, Settings, ArrowLeft, Plus, List } from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useProcessStore } from "@/process/useProcessStore";
import { useTaskStore } from "@/task/useTaskStore";
import type { Task } from "@/task/Task";

export const getProcessById = (id: string) => {
  const store = useProcessStore.getState();
  return store.processes.find((p) => p.id === id) ?? null; // Optional: undefined statt null
};

export const getTasksByProcessId = (processId: string): Task[] => {
  const store = useTaskStore.getState();
  return store.tasks.filter((t) => t.processId === processId);
};


const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { processId, taskId } = useParams();

  const pathname = location.pathname;

  const showBackButton = pathname !== "/processes";

  const isOnProcessList = pathname === "/processes" || pathname === "/processes/";
  const isOnTaskList = pathname === `/processes/${processId}/tasks` && !taskId;

  const handlePlusClick = () => {
    if (isOnProcessList) {
      // Neuer Prozess → Step 1 starten
      navigate("/processes/create/step-1");
    } else if (isOnTaskList && processId) {
      // Prozess bearbeiten → direkt in Step 2 mit bestehenden Tasks
      // Prozess laden
      const process = getProcessById(processId);

      // Tasks separat laden
      const tasks = getTasksByProcessId(processId);

      // Du kannst die Tasks in den Store setzen, bevor du navigierst
      useTaskStore.getState().setTasks(tasks);
      useProcessStore.getState().selectProcess(process);

      navigate("/processes/create/step-2");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <footer className="h-10 flex items-center justify-between px-4 bg-indigo-100">
      {/* Navigation Links (Home, Settings, Profile) */}
      <div className="flex gap-6">
        <NavLink to="/processes" className="flex flex-col items-center text-sm">
          <List className="h-6 w-6" />
        </NavLink>
        <NavLink to="/settings" className="flex flex-col items-center text-sm">
          <Settings className="h-6 w-6" />
        </NavLink>
        <NavLink to="/profile" className="flex flex-col items-center text-sm">
          <User className="h-6 w-6" />
        </NavLink>

        {/* Plus-Button */}
        {(isOnProcessList || isOnTaskList) && (
          <button
            onClick={handlePlusClick}
            className="text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Aktions-Buttons: Zurück */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="text-gray-700 hover:text-black"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
      </div>
    </footer>
  );
};

export default BottomNav;
