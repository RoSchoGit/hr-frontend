import { useNavigate, useOutletContext } from "react-router-dom";
import TaskCard from "@/features/task/components/TaskCard";
import { createProcess } from "../../../features/process/api/processApi";
import { createTask } from "@/features/task/api/taskApi";
import type { Process } from "@/features/process/Process";
import type { TaskImpl } from "@/features/task/Task";
import "./CreateStep3Page.css";

type OutletCtx = {
    draftProcess: Process | null;
    setDraftProcess: (p: Process | null) => void;
    tasks: TaskImpl[];
    setTasks: (t: TaskImpl[]) => void;
};

export default function CreateStep3() {
    const navigate = useNavigate();
    const { draftProcess: process, setDraftProcess, tasks, setTasks } = useOutletContext<OutletCtx>();

    if (!process) {
        return <div className="create-step3"><p style={{ color: 'red' }}>Kein Prozess-Draft gefunden. Bitte zuerst Schritt 1/2 ausfüllen.</p></div>;
    }

    const serializeProcess = (p: any) => ({
        id: p.id,
        title: p.title ?? null,
        description: p.description ?? null,
        type: p.type ?? null,
        status: p.status ?? null,
        creator: p.creator ?? null,
        createdAt: p.createdAt ? (p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt)) : null,
        completedAt: p.completedAt ? (p.completedAt instanceof Date ? p.completedAt.toISOString() : String(p.completedAt)) : null,
        dueDate: p.dueDate ? (p.dueDate instanceof Date ? p.dueDate.toISOString() : String(p.dueDate)) : null,
        industries: Array.isArray(p.industries) ? p.industries : [],
        metadata: p.metadata ?? undefined,
    });

    const serializeTask = (t: any, processId: string) => ({
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
    });

    const handleSubmit = async () => {
        if (!process) return;

        try {
            const savedProcess = await createProcess(serializeProcess(process));
            await Promise.all((tasks ?? []).map((t) => createTask(serializeTask(t, savedProcess.id))));
            setDraftProcess(null);
            setTasks([]);
            navigate("/processes");
        } catch (err) {
            console.error("Fehler beim Erstellen:", err);
            alert("Es gab ein Problem beim Erstellen des Prozesses. Schau in die Konsole.");
        }
    };

    return (
        <div className="create-step3">
            <h2>Zusammenfassung: {process.title}</h2>
            <p>Anzahl Tasks: {tasks?.length ?? 0}</p>

            <div className="task-list">
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

            <div className="actions">
                <button className="btn-back" onClick={() => navigate(-1)}>Zurück</button>
                <button className="btn-submit" onClick={handleSubmit}>Prozess erstellen</button>
            </div>
        </div>
    );
}
