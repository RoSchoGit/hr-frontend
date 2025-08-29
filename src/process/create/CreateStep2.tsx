import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskImpl, TaskStatus, TaskType } from "@/task/Task";
import type { Attachment } from "@/task/Task";
import TaskList from "@/task/TaskList";
import { useTaskStore } from "@/task/useTaskStore";
import useProcessStore from "../useProcessStore";
import { metadataTemplates } from "./metadataTemplates";
import type { MetadataField } from "./metadataTemplates";
import type { Metadata } from "../Process";
import { TextIcon, Tally5Icon, CalendarIcon } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useRef } from "react"; // ⬅️ useRef ergänzt

const assigneeOptions = ["Alice", "Bob", "Charlie"];

type MetadataFieldExtended = MetadataField & { id: string; value?: string };

export default function CreateStep2() {
    const navigate = useNavigate();
    const process = useProcessStore.getState().selectedProcess;
    const { addTask: addTaskToStore, moveTask, setDeleteCandidate, getTasksForProcess } = useTaskStore();

    if (!process) return <div>Kein Prozess gefunden.</div>;

    const tasks = getTasksForProcess(process.id);

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

    // ⬅️ OnInit: zum Anker scrollen (scrollt den nächstgelegenen Scroll-Container)
    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }, []);

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
            // Nutze das Label als Schlüssel
            if (f.label.trim()) {
                metadataObject[f.label] = f.value;
            } else {
                // Falls Label leer, fallback auf key
                metadataObject[f.key] = f.value;
            }
        });

        const task = new TaskImpl(
            uuidv4(),
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

        // ⬅️ Nach dem Hinzufügen: zum Anker scrollen (nächster Scroll-Container)
        // requestAnimationFrame stellt sicher, dass nach dem Re-Render gescrollt wird
        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    useEffect(() => {
        if (!effectiveMetadata.length) return;

        setNewTask(prev => {
            // Kopie der aktuellen metadata
            const updatedMetadata = [...prev.metadata];

            effectiveMetadata.forEach(f => {
                // Prüfen, ob Feld bereits existiert (über key)
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
                processName={process.title}
                tasks={tasks}
                setDeleteCandidate={setDeleteCandidate}
                showReorderButtons
                allowEditing
                onMoveTask={(oldIndex, newIndex) => moveTask(process.id, oldIndex, newIndex)}
            />

            <div className="flex flex-col gap-3 p-4 sm:p-6">

                {/* Pflichtfelder */}
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

                    <label className="font-medium text-sm">Fälligkeitsdatum</label>
                    <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="border border-gray-400 rounded px-3 py-2 w-full bg-yellow-50 focus:border-yellow-400 text-sm"
                    />
                </div>

                {/* Zusätzliche Felder */}
                <div className="flex flex-col gap-3">
                    <h4 className="font-semibold">Zusätzliche Felder</h4>
                    {newTask.metadata.map((field) => (
                        <div key={field.id} className="flex flex-col gap-1 border p-2 rounded bg-gray-50">
                            {/* Label + Typ nebeneinander */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Feldname"
                                    value={field.label}
                                    onChange={(e) => handleMetaChange(field.id, "label", e.target.value)}
                                    className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2"
                                />

                                {/* Icon Dropdown für Typ */}
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                        >
                                            {field.type === "text" && <TextIcon className="w-4 h-4" />}
                                            {field.type === "number" && <Tally5Icon className="w-4 h-4" />}
                                            {field.type === "date" && <CalendarIcon className="w-4 h-4" />}
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Content
                                        className="bg-white border border-gray-200 rounded shadow-md p-1"
                                        sideOffset={4}
                                    >
                                        <DropdownMenu.Item
                                            onSelect={() => handleMetaChange(field.id, "type", "text")}
                                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                        >
                                            <TextIcon className="w-4 h-4" /> Text
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            onSelect={() => handleMetaChange(field.id, "type", "number")}
                                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                        >
                                            <Tally5Icon className="w-4 h-4" /> Number
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            onSelect={() => handleMetaChange(field.id, "type", "date")}
                                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                        >
                                            <CalendarIcon className="w-4 h-4" /> Date
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </div>

                            {/* Wert unten */}
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
                    onClick={() => navigate("/processes/create/step-3")}
                    disabled={tasks.length === 0}
                    className={`px-4 py-2 rounded text-white w-full mt-4 ${tasks.length ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    Weiter
                </button>
            </div >
        </>
    );

}
