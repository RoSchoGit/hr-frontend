import { useParams } from "react-router-dom";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import DetailPage from "@/components/DetailPage";

const ProcessPage = () => {
  const { processId } = useParams<{ processId: string }>();
  const { processes } = useProcessStore();
  const { getTasksForProcess } = useTaskStore();

  const process = processes.find((p) => p.id === processId);
  if (!process) return <DetailPage title="Prozess nicht gefunden" description="Der Prozess existiert nicht." />;

  const tasks = getTasksForProcess(processId) || [];

  return (
    <DetailPage
      title={process.title}
      description={process.description || "Keine Beschreibung"}
      fields={[
        { label: "Typ", value: process.type },
        { label: "Status", value: process.status },
        { label: "Ersteller", value: process.creator },
        { label: "Erstellt am", value: process.createdAt.toLocaleDateString("de-DE") },
        ...(process.dueDate ? [{ label: "Fällig am", value: process.dueDate.toLocaleDateString("de-DE") }] : []),
        ...(process.completedAt ? [{ label: "Abgeschlossen am", value: process.completedAt.toLocaleDateString("de-DE") }] : []),
      ]}
      lists={[
        { title: "Industrien", items: process.industries },
        { title: "Tasks", items: tasks.map((t) => t.title) },
        { title: "History", items: process.history.map((h) => `[${new Date(h.date).toLocaleString("de-DE")}] ${h.changedBy}: ${h.status}`) },
      ]}
      metadata={process.metadata}
    />
  );
};

export default ProcessPage;
