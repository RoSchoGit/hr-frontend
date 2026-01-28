import { useState, useEffect, useRef } from "react";
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
import "./TaskListEditPage.css";

const assigneeOptions = ["Alice", "Bob", "Charlie"];

type MetadataFieldExtended = MetadataField & { id: string; value?: string };

export default function TaskListEditPage() {
    const process = useProcessStore.getState().selectedProcess;
    if (!process) return <div>Kein Prozess gefunden.</div>;

    const addTaskToStore = useTaskStore((s) => s.addTask);
    const moveTask = useTaskStore((s) => s.moveTask);
    const updateTasksForProcess = useTaskStore((s) => s.updateTasksForProcess);

    const tasks = useTaskStore((s) => s.tasksByProcessId[process.id] ?? []);

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

    const industry = Array.isArray(process.industries)
        ? process.industries[0]
        : process.industries;

    const effectiveMetadata: MetadataField[] =
        metadataTemplates[industry]?.[newTask.type] || [];

    const handleMetaChange = <K extends keyof MetadataFieldExtended>(
        id: string,
        field: K,
        value: MetadataFieldExtended[K]
    ) => {
        setNewTask((prev) => ({
            ...prev,
            metadata: prev.metadata.map((f) =>
                f.id === id ? { ...f, [field]: value } : f
            ),
        }));
    };

    const handleChange = (key: string, value?: Date | undefined) => {
        setNewTask((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
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
            metadataObject[f.label?.trim() ? f.label : f.key] = f.value;
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
        addTaskToStore(task);

        setNewTask({
            title: "",
            description: "",
            type: TaskType.NOT_SPECIFIC,
            assignee: "",
            dueDate: "",
            attachments: [],
            metadata: [],
        });

        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    useEffect(() => {
        if (!effectiveMetadata.length) return;

        setNewTask((prev) => {
            const updated = [...prev.metadata];
            effectiveMetadata.forEach((f) => {
                if (!updated.find((m) => m.key === f.key)) {
                    updated.push({ ...f, id: f.key, value: "" });
                }
            });
            return { ...prev, metadata: updated };
        });
    }, [newTask.type, effectiveMetadata]);

    return (
        <div className="task-list-edit">
            <div ref={topRef} />
            <TaskList
                tasks={tasks}
                onMoveTask={(oldIndex, newIndex) =>
                    moveTask(process.id, oldIndex, newIndex)
                }
            />

            <div className="task-list-edit__form">
                <div className="task-list-edit__section">
                    <h3 className="task-list-edit__title">Neuer Task erstellen</h3>

                    <label className="task-list-edit__label">Task Titel</label>
                    <input
                        className="task-list-edit__input"
                        value={newTask.title}
                        onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                        }
                    />

                    <label className="task-list-edit__label">Beschreibung</label>
                    <textarea
                        className="task-list-edit__textarea"
                        value={newTask.description}
                        onChange={(e) =>
                            setNewTask({ ...newTask, description: e.target.value })
                        }
                    />

                    <label className="task-list-edit__label">Typ</label>
                    <select
                        className="task-list-edit__select"
                        value={newTask.type}
                        onChange={(e) =>
                            setNewTask({ ...newTask, type: e.target.value as TaskType })
                        }
                    >
                        {Object.values(TaskType).map((tt) => (
                            <option key={tt} value={tt}>
                                {tt}
                            </option>
                        ))}
                    </select>

                    <label className="task-list-edit__label">Assignee</label>
                    <select
                        className="task-list-edit__select"
                        value={newTask.assignee}
                        onChange={(e) =>
                            setNewTask({ ...newTask, assignee: e.target.value })
                        }
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
                        picker="react"
                        value={newTask.dueDate}
                        onChange={(val) =>
                            handleChange(
                                "dueDate",
                                val ? parseLocalInputToDate(val) : undefined
                            )
                        }
                    />
                </div>

                <div className="task-list-edit__section">
                    <h4 className="task-list-edit__subtitle">Zusätzliche Felder</h4>

                    <div className="task-list-edit__meta-list">
                        {newTask.metadata.map((field) => (
                            <div key={field.id} className="task-list-edit__meta-item">
                                <div className="task-list-edit__meta-header">
                                    <input
                                        className="task-list-edit__meta-name"
                                        value={field.label}
                                        placeholder="Feldname"
                                        onChange={(e) =>
                                            handleMetaChange(field.id, "label", e.target.value)
                                        }
                                    />

                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button className="task-list-edit__icon-btn">
                                                {field.type === "text" && <TextIcon size={16} />}
                                                {field.type === "number" && <Tally5Icon size={16} />}
                                                {field.type === "date" && <CalendarIcon size={16} />}
                                            </button>
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content sideOffset={4}>
                                            <DropdownMenu.Item
                                                onSelect={() =>
                                                    handleMetaChange(field.id, "type", "text")
                                                }
                                            >
                                                <TextIcon size={14} /> Text
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onSelect={() =>
                                                    handleMetaChange(field.id, "type", "number")
                                                }
                                            >
                                                <Tally5Icon size={14} /> Number
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onSelect={() =>
                                                    handleMetaChange(field.id, "type", "date")
                                                }
                                            >
                                                <CalendarIcon size={14} /> Date
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </div>

                                <input
                                    className="task-list-edit__meta-value"
                                    type={field.type}
                                    value={field.value || ""}
                                    placeholder="Wert eingeben"
                                    onChange={(e) =>
                                        handleMetaChange(field.id, "value", e.target.value)
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addCustomField}
                        className="task-list-edit__add-field"
                    >
                        + Feld hinzufügen
                    </button>
                </div>

                <button
                    onClick={addTask}
                    className="task-list-edit__action task-list-edit__action--add"
                >
                    + Task hinzufügen
                </button>

                <button
                    onClick={handleSave}
                    className="task-list-edit__action task-list-edit__action--save"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
