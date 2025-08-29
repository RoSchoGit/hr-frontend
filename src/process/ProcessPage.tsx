import { useParams, useNavigate } from "react-router-dom";
import { useProcessStore } from "@/process/useProcessStore";
import Header from "@/components/Header";
import { useTaskStore } from "@/task/useTaskStore";
import { useEffect } from "react";

const ProcessPage = () => {
    const { processId } = useParams<{ processId: string }>();
    const { processes, updateProcess } = useProcessStore();
    const { getTasksForProcess, loadTasksForProcess } = useTaskStore();

    useEffect(() => {
        if (processId) {
            const tasks = getTasksForProcess(processId);
            if (!tasks || tasks.length === 0) {
                loadTasksForProcess(processId);
            }
        }
    }, [processId, getTasksForProcess, loadTasksForProcess]);

    const parsedProcesses = processes.map(p => ({
        ...p,
        industries: p.industries ?? [],
        createdAt: new Date(p.createdAt),
        dueDate: p.dueDate ? new Date(p.dueDate) : undefined,
        completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
    }));

    const navigate = useNavigate();

    const process = parsedProcesses.find(p => p.id === processId);

    const tasks = getTasksForProcess(processId) || [];

    if (!process) return <div>Prozess nicht gefunden</div>;

    return (
        <>
            <Header title={process.title} />
            <div className="p-6 space-y-4">
                <p className="text-gray-600">{process.description ?? "Keine Beschreibung"}</p>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="font-semibold">Typ</h2>
                        <p>{process.type}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Status</h2>
                        <p>{process.status}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Ersteller</h2>
                        <p>{process.creator}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Erstellt am</h2>
                        <p>{process.createdAt.toLocaleDateString("de-DE")}</p>
                    </div>
                    {process.dueDate && (
                        <div>
                            <h2 className="font-semibold">Fällig am</h2>
                            <p>{process.dueDate.toLocaleDateString("de-DE")}</p>
                        </div>
                    )}
                    {process.completedAt && (
                        <div>
                            <h2 className="font-semibold">Abgeschlossen am</h2>
                            <p>{process.completedAt.toLocaleDateString("de-DE")}</p>
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="font-semibold">Industrien</h2>
                    <ul className="list-disc pl-6">
                        {process.industries.map((ind) => (
                            <li key={ind}>{ind}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold">Tasks</h2>
                    <ul className="list-disc pl-6">
                        {tasks.length > 0
                            ? tasks.map((t) => <li key={t.id}>{t.title}</li>)
                            : <li>Keine Tasks</li>}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold">History</h2>
                    <ul className="list-disc pl-6">
                        {process.history.map((h, i) => (
                            <li key={i}>
                                [{new Date(h.date).toLocaleString("de-DE")}] {h.changedBy}: {h.status}
                            </li>
                        ))}
                    </ul>
                </div>

                {process.metadata && (
                    <div>
                        <h2 className="font-semibold">Metadata</h2>
                        <pre className="bg-gray-100 p-2 rounded text-sm">
                            {JSON.stringify(process.metadata, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProcessPage;