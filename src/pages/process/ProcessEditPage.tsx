import React, { useEffect, useState } from "react";
import useProcessStore from "@/features/process/store/useProcessStore";
import type { Process } from "@/features/process/Process";
import { useOutletContext } from "react-router-dom";
import type { ProcessContextType } from "@/pages/process/ProcessLayout";
import DateTimeInput from "@/components/DateTimeInput";
import { parseLocalInputToDate } from "@/utils/date";
import "./ProcessEditPage.css";

const ProcessEditPage: React.FC = () => {
  const { updateProcess } = useProcessStore();
  const { process } = useOutletContext<ProcessContextType>();
  const [form, setForm] = useState<Process | null>(process ? { ...process } : null);

  useEffect(() => {
    if (process) setForm({ ...process });
    else setForm(null);
  }, [process]);

  if (!process || !form) return <div className="process-edit"><p>Prozess nicht gefunden</p></div>;

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
      // debug logging (optional)
      console.log("sending payload.dueDate =", form.dueDate);
      await updateProcess(form);
      // optional: show toast or navigate away
    } catch (err) {
      console.error("Save failed", err);
      alert("Fehler beim Speichern des Prozesses. Siehe Konsole.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="process-edit">
      <div className="process-edit__row">
        <label className="process-edit__label">Titel</label>
        <input
          className="process-edit__input"
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="process-edit__row">
        <label className="process-edit__label">Beschreibung</label>
        <textarea
          className="process-edit__textarea"
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="process-edit__row">
        <DateTimeInput
          label="Fällig am (Datum + Uhrzeit)"
          mode="datetime-local"
          picker="react"
          value={form.dueDate}
          onChange={(val) => handleChange("dueDate", val ? parseLocalInputToDate(val) : undefined)}
        />
        <div className="process-edit__helper">Datum / Uhrzeit optional im lokalen Format</div>
      </div>

      <div className="process-edit__actions">
        <button type="button" className="process-edit__btn process-edit__btn--ghost" onClick={() => window.history.back()}>
          Abbrechen
        </button>

        <button type="submit" className="process-edit__btn process-edit__btn--primary">
          Speichern
        </button>
      </div>
    </form>
  );
};

export default ProcessEditPage;
