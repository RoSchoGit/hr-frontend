import { useParams } from "react-router-dom";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import DetailPage from "@/components/DetailPage";

const TaskPage = () => {
  const { taskId } = useParams();
  const { getTaskById } = useTaskStore();
  const task = getTaskById(taskId);

  if (!task) return <DetailPage title="Task nicht gefunden" description="Task existiert nicht." />;

  return (
    <DetailPage
      title={task.title}
      description={task.description || "Keine Beschreibung vorhanden."}
      fields={[
        { label: "Typ", value: task.type },
        { label: "Status", value: task.status },
      ]}
      lists={[
        { title: "Zusätzliche Felder", items: Object.entries(task.metadata || {}).map(([k, v]) => `${k}: ${v}`) },
      ]}
    />
  );
};

export default TaskPage;
