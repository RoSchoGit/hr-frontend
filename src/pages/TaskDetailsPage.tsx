import AppLayout from "@/layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { sampleTasks } from "@/layouts/sampleTasks";

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Task suchen anhand der ID
  const task = sampleTasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <AppLayout>
        <div className="p-4">Task nicht gefunden</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-2">{task.title}</h2>
        <p className="text-sm text-gray-600 mb-2">Typ: {task.type}</p>
        <p className="mb-4">{task.description}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate(-1)} // Zurück zur vorherigen Seite
        >
          Zurück
        </button>
      </div>
    </AppLayout>
  );
};

export default TaskDetailsPage;

