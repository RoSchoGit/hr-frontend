// CreateStep2.tsx
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskImpl, TaskStatus, TaskType } from "@/features/task/Task";
import type { Attachment } from "@/features/task/Task";
import TaskList from "@/features/task/components/TaskList";
import { metadataTemplates } from "./metadataTemplates";
import type { MetadataField } from "./metadataTemplates";
import type { Metadata, Process } from "@/features/process/Process";
import { TextIcon, Tally5Icon, CalendarIcon } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DateTimeInput from "@/components/DateTimeInput";
import { parseLocalInputToDate } from "@/utils/date";

const assigneeOptions = ["Alice", "Bob", "Charlie"];

type MetadataFieldExtended = MetadataField & { id: string; value?: string };

// Outlet Context (expect layout to provide draftProcess + tasks)
type OutletCtx = {
    draftProcess: Process | null;
    setDraftProcess: (p: Process | null) => void;
    tasks: TaskImpl[]; // or whatever Task type you use
    setTasks: (tasks: TaskImpl[]) => void;
};

export default function CreateStep2() {
    const navigate = useNavigate();
    const { draftProcess, setDraftProcess, tasks, setTasks } = useOutletContext<OutletCtx>();

    // Guard: falls kein draftProcess da ist -> Nutzer zuerst zu Step1 schicken
    if (!draftProcess) {
        return <div>Kein Prozess-Draft vorhanden — bitte zuerst Schritt 1 ausfüllen.</div>;
    }

    // processId & industries (sicher mit Fallbacks)
    const processId = draftProcess.id;
    const industries = Array.isArray(draftProcess.industries) ? draftProcess.industries : [];
    const industry = industries[0];

    // local form state für neuen Task
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        type: TaskType.NOT_SPECIFIC,
        assignee: "",
        dueDate: "",
        attachments: [] as Attachment[],
        metadata: [] as MetadataFieldExtended[],
    });

    const topRef = useRef<HTMLDivElement | null>(null);

    // metadata templates für die gegebene industry + task type
    const effectiveMetadata: MetadataField[] = industry ? (metadataTemplates[industry]?.[newTask.type] || []) : [];

    // Reorder tasks helper
    const moveTask = (oldIndex: number, newIndex: number) => {
        if (!Array.isArray(tasks)) return;
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

    // Metadaten-Änderung im newTask-Form
    const handleMetaChange = <K extends keyof MetadataFieldExtended>(
        id: string,
        field: K,
        value: MetadataFieldExtended[K]
    ) => {
        setNewTask((prev) => {
            const updated = prev.metadata.map((f) => (f.id === id ? { ...f, [field]: value } : f));
            return { ...prev, metadata: updated };
        });
    };

    const handleChange = (key: string, value?: Date | undefined) => {
        setNewTask(prev => ({ ...prev, [key]: value }));
      };

    // neues Custom-Metafeld hinzufügen
    const addCustomField = () => {
        setNewTask((prev) => ({
            ...prev,
            metadata: [
                ...prev.metadata,
                {
                    id: uuidv4(),
                    key: `custom_${prev.metadata.length + 1}`,
                    label: "",
                    type: "text",
                    required: false,
                    value: "",
                },
            ],
        }));
    };

    // Task hinzufügen — nutzt processId vom Draft
    const addTask = () => {
        if (!newTask.title.trim()) return;

        const metadataObject: Metadata = {};
        newTask.metadata.forEach((f) => {
            if (f.label?.trim()) metadataObject[f.label] = f.value;
            else metadataObject[f.key] = f.value;
        });

        const id = uuidv4();
        const order = (tasks?.length ?? 0) + 1;
        const task = new TaskImpl(
            id,
            processId,
            newTask.type,
            newTask.title,
            newTask.description,
            "currentUser",
            newTask.assignee || "Unassigned",
            order,
            newTask.dueDate ? new Date(newTask.dueDate) : undefined,
            newTask.attachments,
            metadataObject
        );
        task.status = TaskStatus.OPEN;

        setTasks([...(tasks ?? []), task]);

        // Formular zurücksetzen
        setNewTask({
            title: "",
            description: "",
            type: TaskType.NOT_SPECIFIC,
            assignee: "",
            dueDate: "",
            attachments: [],
            metadata: [],
        });

        // Scroll to top anchor
        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    // Effect: füge template-metafields hinzu, falls nötig
    useEffect(() => {
        if (!effectiveMetadata.length) return;
        setNewTask((prev) => {
            const updatedMetadata = [...prev.metadata];
            effectiveMetadata.forEach((f) => {
                if (!updatedMetadata.find((m) => m.key === f.key)) {
                    updatedMetadata.push({ ...f, id: f.key, value: "" });
                }
            });
            return { ...prev, metadata: updatedMetadata };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newTask.type, industry]);

    return (
        <>
            <div ref={topRef} />

            <TaskList tasks={tasks ?? []} onMoveTask={(oldIndex, newIndex) => moveTask(oldIndex, newIndex)} />

            <div className="flex flex-col gap-3 p-4 sm:p-6">
                <div className="flex flex-col gap-2 mb-4">
                    <h3 className="font-semibold text-lg mb-2">Neuer Task erstellen</h3>

                    <label className="font-medium text-sm">Task Titel</label>
                    <input
                        type="text"
                        placeholder="Titel eingeben"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="border border-gray-400 rounded px-3 py-2 w-full bg-yellow-50 focus:border-yellow-400"
                    />

                    <label className="font-medium text-sm">Beschreibung</label>
                    <textarea
                        placeholder="Beschreibung"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="border border-gray-400 rounded px-3 py-2 w-full bg-yellow-50 focus:border-yellow-400"
                    />

                    <label className="font-medium text-sm">Typ</label>
                    <select
                        value={newTask.type}
                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskType })}
                        className="border border-gray-400 rounded px-3 py-2 w-full bg-yellow-50 focus:border-yellow-400 text-sm"
                    >
                        {Object.values(TaskType).map((tt) => (
                            <option key={tt} value={tt}>
                                {tt}
                            </option>
                        ))}
                    </select>

                    <label className="font-medium text-sm">Assignee</label>
                    <select
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        className="border border-gray-400 rounded px-3 py-2 w-full bg-yellow-50 focus:border-yellow-400 text-sm"
                    >
                        <option value="">Unassigned</option>
                        {assigneeOptions.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                    <DateTimeInput
                        label="Fällig am (Datum + Uhrzeit)"
                        mode="datetime-local"
                        picker="react"               // <-- Wichtig!
                        value={newTask.dueDate}
                        onChange={(val) => handleChange("dueDate", val ? parseLocalInputToDate(val) : undefined)}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-semibold">Zusätzliche Felder</h4>
                    {newTask.metadata.map((field) => (
                        <div key={field.id} className="flex flex-col gap-1 border p-2 rounded bg-background">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Feldname"
                                    value={field.label}
                                    onChange={(e) => handleMetaChange(field.id, "label", e.target.value)}
                                    className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2"
                                />

                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-surface">
                                            {field.type === "text" && <TextIcon className="w-4 h-4" />}
                                            {field.type === "number" && <Tally5Icon className="w-4 h-4" />}
                                            {field.type === "date" && <CalendarIcon className="w-4 h-4" />}
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Content className="bg-white border border-border rounded shadow-md p-1" sideOffset={4}>
                                        <DropdownMenu.Item
                                            onSelect={() => handleMetaChange(field.id, "type", "text")}
                                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface cursor-pointer"
                                        >
                                            <TextIcon className="w-4 h-4" /> Text
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            onSelect={() => handleMetaChange(field.id, "type", "number")}
                                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface cursor-pointer"
                                        >
                                            <Tally5Icon className="w-4 h-4" /> Number
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            onSelect={() => handleMetaChange(field.id, "type", "date")}
                                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface cursor-pointer"
                                        >
                                            <CalendarIcon className="w-4 h-4" /> Date
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </div>

                            <input
                                type={field.type}
                                placeholder="Wert eingeben"
                                value={field.value || ""}
                                onChange={(e) => handleMetaChange(field.id, "value", e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>
                    ))}

                    <button onClick={addCustomField} className="px-3 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 mt-2 w-max">
                        + Feld hinzufügen
                    </button>
                </div>

                <button onClick={addTask} className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 mt-4 w-full">
                    + Task hinzufügen
                </button>

                <button
                    onClick={() => navigate("/processes/create/step-3")}
                    disabled={!(tasks?.length)}
                    className={`px-4 py-2 rounded text-white w-full mt-4 ${tasks?.length ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    Weiter
                </button>
            </div>
        </>
    );
}
