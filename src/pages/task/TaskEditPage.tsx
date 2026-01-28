import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DateTimeInput from "@/components/DateTimeInput";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import type { Task } from "@/features/task/Task";
import { TaskStatus, TaskType } from "@/features/task/Task";
import { parseLocalInputToDate } from "@/utils/date";
import "./TaskEditPage.css";

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
                    const normalizedDueDate = (t as any).dueDate
                        ? new Date((t as any).dueDate)
                        : undefined;

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
    }, [taskId]);

    if (loading) return <div className="task-edit__loading">Lade Aufgabe …</div>;
    if (error) return <div className="task-edit__error-page">Fehler: {error}</div>;
    if (!task || !form) return <div className="task-edit__loading">Aufgabe nicht gefunden.</div>;

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
        <div className="task-edit">
            <form onSubmit={handleSubmit} className="task-edit__form">
                <div className="task-edit__field">
                    <label className="task-edit__label">Titel</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="task-edit__input"
                        required
                    />
                </div>

                <div className="task-edit__field">
                    <label className="task-edit__label">Beschreibung</label>
                    <textarea
                        value={form.description ?? ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="task-edit__textarea"
                    />
                </div>

                <div className="task-edit__field">
                    <label className="task-edit__label">Typ</label>
                    <select
                        value={form.type}
                        onChange={(e) => handleChange("type", e.target.value as TaskType)}
                        className="task-edit__select"
                    >
                        {Object.values(TaskType).map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="task-edit__field">
                    <label className="task-edit__label">Status</label>
                    <select
                        value={form.status}
                        onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
                        className="task-edit__select"
                    >
                        {Object.values(TaskStatus).map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="task-edit__field">
                    <label className="task-edit__label">Zuständig (Assignee)</label>
                    <input
                        type="text"
                        value={form.assignee ?? ""}
                        onChange={(e) => handleChange("assignee", e.target.value)}
                        className="task-edit__input"
                    />
                </div>

                <div className="task-edit__field">
                    <label className="task-edit__label">Position (Sortierung)</label>
                    <input
                        type="number"
                        value={form.position}
                        onChange={(e) => handleChange("position", Number(e.target.value))}
                        className="task-edit__input"
                    />
                </div>

                <div className="task-edit__field">
                    <DateTimeInput
                        label="Fällig am (Datum + Uhrzeit)"
                        mode="datetime-local"
                        picker="react"
                        value={form.dueDate}
                        onChange={(val) =>
                            handleChange("dueDate", val ? parseLocalInputToDate(val) : undefined)
                        }
                    />
                </div>

                {error && <div className="task-edit__error">{error}</div>}

                <div className="task-edit__actions">
                    <button
                        type="submit"
                        disabled={saving}
                        className="task-edit__btn task-edit__btn--primary"
                    >
                        {saving ? "Speichere…" : "Speichern"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="task-edit__btn task-edit__btn--secondary"
                        disabled={saving}
                    >
                        Abbrechen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskEditPage;
