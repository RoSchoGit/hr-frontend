import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskImpl, TaskStatus, TaskType } from "@/features/task/Task";
import type { Attachment } from "@/features/task/Task";
import TaskList from "@/features/task/components/TaskList";
import { metadataTemplates } from "./metadataTemplates";
import type { MetadataField } from "./metadataTemplates";
import type { Metadata, Process } from "@/features/process/Process";
import DateTimeInput from "@/components/DateTimeInput";
import { parseLocalInputToDate } from "@/utils/date";
import "./CreateStep2Page.css";

const assigneeOptions = ["Alice", "Bob", "Charlie"];
type MetadataFieldExtended = MetadataField & { id: string; value?: string };

type OutletCtx = {
    draftProcess: Process | null;
    setDraftProcess: (p: Process | null) => void;
    tasks: TaskImpl[];
    setTasks: (tasks: TaskImpl[]) => void;
};

export default function CreateStep2() {
    const navigate = useNavigate();
    const { draftProcess, tasks, setTasks } = useOutletContext<OutletCtx>();
    const topRef = useRef<HTMLDivElement | null>(null);

    if (!draftProcess) {
        return <div>Kein Prozess-Draft vorhanden — bitte zuerst Schritt 1 ausfüllen.</div>;
    }

    const processId = draftProcess.id;
    const industries = Array.isArray(draftProcess.industries) ? draftProcess.industries : [];
    const industry = industries[0];

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        type: TaskType.NOT_SPECIFIC,
        assignee: "",
        dueDate: "",
        attachments: [] as Attachment[],
        metadata: [] as MetadataFieldExtended[],
    });

    const effectiveMetadata: MetadataField[] = industry ? (metadataTemplates[industry]?.[newTask.type] || []) : [];

    const moveTask = (oldIndex: number, newIndex: number) => {
        const copy = [...tasks];
        const [item] = copy.splice(oldIndex, 1);
        copy.splice(newIndex, 0, item);
        // update order/index
        const updated = copy.map((t, i) => {
            // Falls TaskImpl-Instanz, update property (mutating is okay if TaskList expects same instances)
            try {
                (t as any).order = i + 1;
            } catch {
                // ignore
            }
            return t;
        });
        setTasks(updated);
    };

    const handleMetaChange = <K extends keyof MetadataFieldExtended>(
        id: string,
        field: K,
        value: MetadataFieldExtended[K]
    ) => {
        setNewTask((prev) => ({
            ...prev,
            metadata: prev.metadata.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
        }));
    };

    const handleChange = (key: string, value?: Date | undefined) => {
        setNewTask(prev => ({ ...prev, [key]: value }));
    };

    const addCustomField = () => {
        setNewTask((prev) => ({
            ...prev,
            metadata: [...prev.metadata, { id: uuidv4(), key: `custom_${prev.metadata.length + 1}`, label: "", type: "text", required: false, value: "" }],
        }));
    };

    const addTask = () => {
        if (!newTask.title.trim()) return;

        const metadataObject: Metadata = {};
        newTask.metadata.forEach((f) => { metadataObject[f.label?.trim() || f.key] = f.value; });

        const task = new TaskImpl(
            uuidv4(),
            processId,
            newTask.type,
            newTask.title,
            newTask.description,
            "currentUser",
            newTask.assignee || "Unassigned",
            tasks.length + 1,
            newTask.dueDate ? new Date(newTask.dueDate) : undefined,
            newTask.attachments,
            metadataObject
        );
        task.status = TaskStatus.OPEN;

        setTasks([...tasks, task]);
        setNewTask({ title: "", description: "", type: TaskType.NOT_SPECIFIC, assignee: "", dueDate: "", attachments: [], metadata: [] });

        requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };

    useEffect(() => {
        if (!effectiveMetadata.length) return;
        setNewTask(prev => {
            const updated = [...prev.metadata];
            effectiveMetadata.forEach(f => {
                if (!updated.find(m => m.key === f.key)) updated.push({ ...f, id: f.key, value: "" });
            });
            return { ...prev, metadata: updated };
        });
    }, [newTask.type, industry]);

    return (
        <div className="create-step2">
            <div ref={topRef} />

            <TaskList tasks={tasks} onMoveTask={moveTask} />

            <div className="section">
                <h3>Neuer Task erstellen</h3>

                <label>Task Titel</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Titel eingeben" />

                <label>Beschreibung</label>
                <textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Beschreibung" />

                <label>Typ</label>
                <select value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value as TaskType })}>
                    {Object.values(TaskType).map(tt => <option key={tt} value={tt}>{tt}</option>)}
                </select>

                <label>Assignee</label>
                <select value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}>
                    <option value="">Unassigned</option>
                    {assigneeOptions.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <DateTimeInput label="Fällig am (Datum + Uhrzeit)" mode="datetime-local" picker="react" value={newTask.dueDate} onChange={val => handleChange("dueDate", val ? parseLocalInputToDate(val) : undefined)} />
            </div>

            <div className="section">
                <h4>Zusätzliche Felder</h4>
                {newTask.metadata.map(field => (
                    <div key={field.id} className="metadata-field">
                        <div className="metadata-field-header">
                            <input type="text" value={field.label} onChange={e => handleMetaChange(field.id, "label", e.target.value)} placeholder="Feldname" />
                        </div>
                        <input type={field.type} value={field.value || ""} onChange={e => handleMetaChange(field.id, "value", e.target.value)} placeholder="Wert eingeben" />
                    </div>
                ))}
                <button onClick={addCustomField} className="btn-add">+ Feld hinzufügen</button>
            </div>

            <button onClick={addTask} className="btn-task">+ Task hinzufügen</button>
            <button onClick={() => navigate("/processes/create/step-3")} disabled={!tasks.length} className="btn-next">Weiter</button>
        </div>
    );
}
