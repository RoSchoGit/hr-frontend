import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DateTimeInput from "@/components/DateTimeInput";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import type { Task } from "@/features/task/Task";
import { TaskStatus, TaskType } from "@/features/task/Task";
import { parseLocalInputToDate } from "@/utils/date";

const pad = (n: number) => n.toString().padStart(2, "0");

const formatDateToLocalInput = (d?: Date | null): string | undefined => {
    if (!d) return undefined;
    const date = d instanceof Date ? d : new Date(d);
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
};

const TaskEditPage: React.FC = () => {
    const { taskId } = useParams<{ taskId?: string }>();
    const navigate = useNavigate();
    const { getTaskById, updateTask } = useTaskStore();

    const [task, setTask] = useState<Task | null>(null);
    const [form, setForm] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        let mounted = true;
        const load = () => {
            if (!taskId) {
                if (mounted) {
                    setError("Keine Task ID in der URL.");
                    setLoading(false);
                }
                return;
            }

            try {
                const t = getTaskById ? getTaskById(taskId) : undefined;
                if (!t) {
                    if (mounted) {
                        setError("Aufgabe nicht im Store gefunden.");
                        setLoading(false);
                    }
                    return;
                }

                if (mounted) {
                    const normalizedDueDate = (t as any).dueDate ? new Date((t as any).dueDate) : undefined;
                    const normalizedTask = { ...t, dueDate: normalizedDueDate } as Task;
                    setTask(normalizedTask);
                    setForm({ ...normalizedTask });
                    setLoading(false);
                }
            } catch (err: any) {
                console.error("Fehler beim Laden der Task:", err);
                if (mounted) {
                    setError(err.message ?? "Fehler beim Laden der Aufgabe.");
                    setLoading(false);
                }
            }
        };

        load();
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]); // getTaskById ist stable aus dem Store; falls nicht, füge es hinzu

    if (loading) return <div className="p-6">Lade Aufgabe …</div>;
    if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
    if (!task || !form) return <div className="p-6">Aufgabe nicht gefunden.</div>;

    const handleChange = (key: keyof Task, value: any) => {
        setForm((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value } as Task;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
        setSaving(true);
        setError(null);

        try {
            await updateTask(form);
            navigate(-1);
        } catch (err: any) {
            console.error("Save failed", err);
            setError("Fehler beim Speichern der Aufgabe. Siehe Konsole.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block font-semibold">Titel</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
            </div>

            <div>
                <label className="block font-semibold">Beschreibung</label>
                <textarea
                    value={form.description ?? ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div>
                <label className="block font-semibold">Typ</label>
                <select
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value as TaskType)}
                    className="border rounded p-2 w-full"
                >
                    {Object.values(TaskType).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block font-semibold">Status</label>
                <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
                    className="border rounded p-2 w-full"
                >
                    {Object.values(TaskStatus).map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block font-semibold">Zuständig (Assignee)</label>
                <input
                    type="text"
                    value={form.assignee ?? ""}
                    onChange={(e) => handleChange("assignee", e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div>
                <label className="block font-semibold">Position (Sortierung)</label>
                <input
                    type="number"
                    value={form.position}
                    onChange={(e) => handleChange("position", Number(e.target.value))}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div>
                <DateTimeInput
                    label="Fällig am (Datum + Uhrzeit)"
                    mode="datetime-local"
                    picker="react"               // <-- Wichtig!
                    value={form.dueDate}
                    onChange={(val) => handleChange("dueDate", val ? parseLocalInputToDate(val) : undefined)                    }
                />
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Speichere…" : "Speichern"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border rounded"
                    disabled={saving}
                >
                    Abbrechen
                </button>
            </div>
        </form>
    );
};

export default TaskEditPage;
