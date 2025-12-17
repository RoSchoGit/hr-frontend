import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskImpl, TaskStatus, TaskType } from "@/features/task/Task";
import type { Attachment } from "@/features/task/Task";
import TaskList from "@/features/task/components/TaskList";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import useProcessStore from "@/features/process/store/useProcessStore";
import { metadataTemplates } from "../process/create/metadataTemplates";
import type { MetadataField } from "../process/create/metadataTemplates";
import type { Metadata } from "@/features/process/Process";
import { TextIcon, Tally5Icon, CalendarIcon } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DateTimeInput from "@/components/DateTimeInput";
import { parseLocalInputToDate } from "@/utils/date";


const assigneeOptions = ["Alice", "Bob", "Charlie"];

type MetadataFieldExtended = MetadataField & { id: string; value?: string };

export default function TaskListEditPage() {
    const process = useProcessStore.getState().selectedProcess;

    if (!process) return <div>Kein Prozess gefunden.</div>;

    const addTaskToStore = useTaskStore(s => s.addTask);
    const moveTask = useTaskStore(s => s.moveTask);
    const updateTasksForProcess = useTaskStore(s => s.updateTasksForProcess);

    const tasks = useTaskStore(s => s.tasksByProcessId[process.id] ?? []);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        type: TaskType.NOT_SPECIFIC,
        assignee: "",
        dueDate: "",
        attachments: [] as Attachment[],
        metadata: [] as MetadataFieldExtended[],
    });

    const topRef = useRef<HTMLDivElement | null>(null); // ⬅️ Anker oben

    const industry = Array.isArray(process.industries) ? process.industries[0] : process.industries;
    const effectiveMetadata: MetadataField[] = metadataTemplates[industry]?.[newTask.type] || [];

    const handleMetaChange = <K extends keyof MetadataFieldExtended>(
        id: string,
        field: K,
        value: MetadataFieldExtended[K]
    ) => {
        setNewTask((prev) => {
            const updated = prev.metadata.map((f) =>
                f.id === id ? { ...f, [field]: value } : f
            );
            return { ...prev, metadata: updated };
        });
    };

    const handleChange = (key: string, value?: Date | undefined) => {
        setNewTask(prev => ({ ...prev, [key]: value }));
      };

    const handleSave = async () => {
        if (!process) return;
        try {
            await updateTasksForProcess(process.id);
        } catch (err) {
            console.error("Fehler beim Speichern der Tasks:", err);
            alert("Fehler beim Speichern der Tasks. Siehe Konsole.");
        }
    };

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

    const addTask = () => {
        if (!newTask.title.trim()) return;

        const metadataObject: Metadata = {};
        newTask.metadata.forEach((f) => {
            if (f.label?.trim()) {
                metadataObject[f.label] = f.value;
            } else {
                metadataObject[f.key] = f.value;
            }
        });

        const task = new TaskImpl(
            `temp-${uuidv4()}`,
            process.id,
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

        // add to store (your store's addTask should also push into newTasks[])
        addTaskToStore(task);

        // reset form
        setNewTask({
            title: "",
            description: "",
            type: TaskType.NOT_SPECIFIC,
            assignee: "",
            dueDate: "",
            attachments: [],
            metadata: [],
        });

        // scroll to top anchor after render
        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    useEffect(() => {
        if (!effectiveMetadata.length) return;

        setNewTask(prev => {
            const updatedMetadata = [...prev.metadata];
            effectiveMetadata.forEach(f => {
                if (!updatedMetadata.find(m => m.key === f.key)) {
                    updatedMetadata.push({ ...f, id: f.key, value: "" });
                }
            });
            return { ...prev, metadata: updatedMetadata };
        });
    }, [newTask.type, effectiveMetadata]);

    return (
        <>
            <div ref={topRef} /> {/* ⬅️ unsichtbarer Anker ganz oben */}
            <TaskList
                tasks={tasks}
                onMoveTask={(oldIndex, newIndex) => moveTask(process.id, oldIndex, newIndex)}
            />

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
                            <option key={tt} value={tt}>{tt}</option>
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
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <DateTimeInput
                        label="Fällig am (Datum + Uhrzeit)"
                        mode="datetime-local"
                        picker="react"               // <-- Wichtig!
                        value={newTask.dueDate}
                        onChange={(val) => handleChange("dueDate", val ? parseLocalInputToDate(val) : undefined)
                        }
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

                    <button
                        onClick={addCustomField}
                        className="px-3 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 mt-2 w-max"
                    >
                        + Feld hinzufügen
                    </button>
                </div>

                {/* Buttons */}
                <button
                    onClick={addTask}
                    className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 mt-4 w-full"
                >
                    + Task hinzufügen
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 mt-4 w-full"
                >
                    Save
                </button>
            </div >
        </>
    );
}
