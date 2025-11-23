import React, { useEffect, useState } from "react";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import type { Process } from "@/features/process/Process"; // passe Pfad an
import { useOutletContext } from "react-router-dom";
import type { ProcessContextType } from "@/pages/process/ProcessLayout";
import DateTimeInput from "@/components/DateTimeInput";

const ProcessEditPage = () => {
    const { updateProcess } = useProcessStore();
    const { process } = useOutletContext<ProcessContextType>();
    // wichtig: dueDate ist jetzt string | undefined | null (LocalDate or LocalDateTime string)
    const [form, setForm] = useState<Process | null>(process ? { ...process } : null);

    useEffect(() => {
        if (process) setForm({ ...process });
        else setForm(null);
    }, [process]);

    if (!process || !form) return <div>Prozess nicht gefunden</div>;

    const handleChange = (key: keyof Process, value: any) => {
        setForm((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
        try {
            console.log("sending payload.dueDate =", form.dueDate);
            await updateProcess(form);
            // optional: toast / navigate
        } catch (err) {
            console.error("Save failed", err);
            alert("Fehler beim Speichern des Prozesses. Siehe Konsole.");
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
                {/* Verwende DateTimeInput; mode kann "date" oder "datetime-local" sein */}
                <DateTimeInput
                    label="Fällig am (Datum + Uhrzeit)"
                    mode="datetime-local"
                    value={form.dueDate ?? undefined}
                    onChange={(val) => handleChange("dueDate", val ?? null)}
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Speichern
                </button>
            </div>
        </form>
    );
};

export default ProcessEditPage;
