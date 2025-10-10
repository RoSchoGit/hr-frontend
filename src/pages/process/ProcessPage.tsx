import { useParams } from "react-router-dom";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import Header from "@/components/Header";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import { useEffect } from "react";
import EmptyState from "@/components/EmptyState";
import SmartText from "@/components/SmartText";

const ProcessPage = () => {
  const { processId } = useParams<{ processId: string }>();
  const { processes } = useProcessStore();
  const { getTasksForProcess, loadTasksForProcess } = useTaskStore();

  useEffect(() => {
    if (processId) {
      const tasks = getTasksForProcess(processId);
      if (!tasks || tasks.length === 0) {
        loadTasksForProcess(processId);
      }
    }
  }, [processId, getTasksForProcess, loadTasksForProcess]);

  const parsedProcesses = processes.map((p) => ({
    ...p,
    industries: p.industries ?? [],
    createdAt: new Date(p.createdAt),
    dueDate: p.dueDate ? new Date(p.dueDate) : undefined,
    completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
  }));

  const process = parsedProcesses.find((p) => p.id === processId);
  const tasks = getTasksForProcess(processId) || [];

  if (!process)
    return (
      <EmptyState
        title="Prozess nicht gefunden"
        message="Der angeforderte Prozess existiert nicht oder wurde gelöscht."
      />
    );

  return (
    <>
      <Header
        title={
          <SmartText variant="h1" className="truncate">
            {process.title}
          </SmartText>
        }
      />
      <div className="p-6 space-y-4">
        <SmartText variant="body" className="text-gray-600">
          {process.description ?? "Keine Beschreibung"}
        </SmartText>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold">
              <SmartText variant="h2">Typ</SmartText>
            </h2>
            <SmartText>{process.type}</SmartText>
          </div>
          <div>
            <h2 className="font-semibold">
              <SmartText variant="h2">Status</SmartText>
            </h2>
            <SmartText>{process.status}</SmartText>
          </div>
          <div>
            <h2 className="font-semibold">
              <SmartText variant="h2">Ersteller</SmartText>
            </h2>
            <SmartText>{process.creator}</SmartText>
          </div>
          <div>
            <h2 className="font-semibold">
              <SmartText variant="h2">Erstellt am</SmartText>
            </h2>
            <SmartText>{process.createdAt.toLocaleDateString("de-DE")}</SmartText>
          </div>
          {process.dueDate && (
            <div>
              <h2 className="font-semibold">
                <SmartText variant="h2">Fällig am</SmartText>
              </h2>
              <SmartText>{process.dueDate.toLocaleDateString("de-DE")}</SmartText>
            </div>
          )}
          {process.completedAt && (
            <div>
              <h2 className="font-semibold">
                <SmartText variant="h2">Abgeschlossen am</SmartText>
              </h2>
              <SmartText>{process.completedAt.toLocaleDateString("de-DE")}</SmartText>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold">
            <SmartText variant="h2">Industrien</SmartText>
          </h2>
          <ul className="list-disc pl-6">
            {process.industries.map((ind) => (
              <li key={ind}>
                <SmartText>{ind}</SmartText>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">
            <SmartText variant="h2">Tasks</SmartText>
          </h2>
          <ul className="list-disc pl-6">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <li key={t.id}>
                  <SmartText>{t.title}</SmartText>
                </li>
              ))
            ) : (
              <li>
                <SmartText>Keine Tasks</SmartText>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">
            <SmartText variant="h2">History</SmartText>
          </h2>
          <ul className="list-disc pl-6">
            {process.history.map((h, i) => (
              <li key={i}>
                <SmartText>
                  [{new Date(h.date).toLocaleString("de-DE")}] {h.changedBy}: {h.status}
                </SmartText>
              </li>
            ))}
          </ul>
        </div>

        {process.metadata && (
          <div>
            <h2 className="font-semibold">
              <SmartText variant="h2">Metadata</SmartText>
            </h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
              <SmartText>{JSON.stringify(process.metadata, null, 2)}</SmartText>
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default ProcessPage;
