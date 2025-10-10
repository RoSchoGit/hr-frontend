import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import type { Process } from "../../features/process/Process";

const ProcessEditPage = () => {
    const { processId } = useParams<{ processId: string }>();
    const { processes, updateProcess } = useProcessStore();
    const navigate = useNavigate();

    const process = processes.find(p => p.id === processId);

    const [form, setForm] = useState(process ? { ...process } : null);

    if (!process || !form) return <div>Prozess nicht gefunden</div>;

    const handleChange = (key: keyof Process, value: any) => {
        setForm(prev => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form) updateProcess(form);
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
                <label className="block font-semibold">Fällig am</label>
                <input
                    type="date"
                    value={form.dueDate ? new Date(form.dueDate).toISOString().substring(0, 10) : ""}
                    onChange={(e) => handleChange("dueDate", e.target.value ? new Date(e.target.value) : undefined)}
                    className="border rounded p-2"
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Speichern
            </button>
        </form>
    );
}

export default ProcessEditPage;
