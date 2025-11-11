// CreateStep3.tsx
import { useNavigate, useOutletContext } from "react-router-dom";
import TaskCard from "@/features/task/components/TaskCard";
import { createProcess } from "../../../features/process/api/processApi";
import { createTask } from "@/features/task/api/taskApi";
import type { Process } from "@/features/process/Process";
import type { TaskImpl } from "@/features/task/Task";

type OutletCtx = {
    draftProcess: Process | null;
    setDraftProcess: (p: Process | null) => void;
    tasks: TaskImpl[];
    setTasks: (t: TaskImpl[]) => void;
};

export default function CreateStep3() {
    const navigate = useNavigate();
    const { draftProcess: process, setDraftProcess, tasks, setTasks } = useOutletContext<OutletCtx>();

    // Guard: falls kein draft vorhanden ist
    if (!process) {
        return <div className="p-4 text-red-500">Kein Prozess-Draft gefunden. Bitte zuerst Schritt 1/2 ausfüllen.</div>;
    }

    // Ersatz für deine serializeProcess-Funktion
    function serializeProcess(p: any) {
        return {
            id: p.id,
            title: p.title ?? null,
            description: p.description ?? null,
            type: p.type ?? null,
            status: p.status ?? null,
            creator: p.creator ?? null,
            // Datumsfelder als ISO-Strings oder null
            createdAt: p.createdAt ? (p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt)) : null,
            completedAt: p.completedAt ? (p.completedAt instanceof Date ? p.completedAt.toISOString() : String(p.completedAt)) : null,
            dueDate: p.dueDate ? (p.dueDate instanceof Date ? p.dueDate.toISOString() : String(p.dueDate)) : null,
            // <<< Wichtig: Sende das Array direkt (nicht als JSON-string)
            industries: Array.isArray(p.industries) ? p.industries : [],
            // <<< Wichtig: Sende metadata als Objekt (falls vorhanden), nicht als JSON-string
            metadata: p.metadata ?? undefined,
            // falls dein Backend weitere Felder erwartet, mappe sie hier (z.B. clientId, historyEntries ...)
        };
    }

    function serializeTask(t: any, processId: string) {
        return {
            id: t.id,
            processId,
            title: t.title,
            description: t.description,
            type: t.type,
            status: t.status,
            creator: t.creator,
            assignee: t.assignee,
            position: t.order ?? t.position ?? 0,
            createdAt: t.createdAt ? (t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt) : null,
            dueDate: t.dueDate ? (t.dueDate instanceof Date ? t.dueDate.toISOString() : t.dueDate) : null,
            completedAt: t.completedAt ? (t.completedAt instanceof Date ? t.completedAt.toISOString() : t.completedAt) : null,
            metadataJson: t.metadata ? JSON.stringify(t.metadata) : null,
        };
    }

    const handleSubmit = async () => {
        if (!process) return;

        try {
            // 1) Create process on server
            const savedProcess = await createProcess(serializeProcess(process));

            // 2) Create tasks in parallel (map local tasks to server tasks)
            await Promise.all((tasks ?? []).map((t) => createTask(serializeTask(t, savedProcess.id))));

            // 3) Cleanup local draft + tasks
            setDraftProcess(null);
            setTasks([]);

            // 4) Navigate away
            navigate("/processes");
        } catch (err) {
            console.error("Fehler beim Erstellen:", err);
            alert("Es gab ein Problem beim Erstellen des Prozesses. Schau in die Konsole.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Zusammenfassung: {process.title}</h2>
            <p className="mb-2">Anzahl Tasks: {tasks?.length ?? 0}</p>

            <div className="flex flex-col gap-3">
                {(tasks ?? []).map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        menuOpen={false}
                        setMenuOpen={() => { }}
                        allowEditing={false}
                        showReorderButtons={false}
                    />
                ))}
            </div>

            <div className="flex gap-2 mt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Zurück
                </button>

                <button
                    onClick={handleSubmit}
                    className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                    Prozess erstellen
                </button>
            </div>
        </div>
    );
}
