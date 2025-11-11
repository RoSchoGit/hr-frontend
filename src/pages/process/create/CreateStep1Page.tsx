// CreateStep1.tsx
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { Process } from "@/features/process/Process";
import { ProcessStatus, ProcessType } from "@/features/process/Process";

type OutletCtx = {
  draftProcess: Process | null;
  setDraftProcess: React.Dispatch<React.SetStateAction<Process | null>>;
  tasks: any[];
  setTasks: (t: any[]) => void;
};

const processTemplates = [
  { id: "p1", name: "Onboarding neuer Mitarbeiter", type: ProcessType.ONBOARDING },
  { id: "p2", name: "Marketing-Kampagne starten", type: ProcessType.PERFORMANCE_REVIEW }
];

export default function CreateStep1() {
  const navigate = useNavigate();
  const { draftProcess, setDraftProcess } = useOutletContext<OutletCtx>();

  // lokale Inputs initialisiert aus draft (falls vorhanden)
  const [title, setTitle] = useState<string>(draftProcess?.title ?? "");
  const [description, setDescription] = useState<string>(draftProcess?.description ?? "");
  const [type, setType] = useState<ProcessType>((draftProcess?.type as ProcessType) ?? ProcessType.ONBOARDING);

  // Sync: wenn draftProcess von außen gesetzt/verändert wird, inputs updaten
  useEffect(() => {
    setTitle(draftProcess?.title ?? "");
    setDescription(draftProcess?.description ?? "");
    setType((draftProcess?.type as ProcessType) ?? ProcessType.ONBOARDING);
  }, [draftProcess]);

  // helper: update draftProcess in context (keine Löschlogik, nur set/update)
  const updateDraft = (patch: Partial<Process>) => {
    setDraftProcess((prev) => {
      const base: Process = prev ?? {
        id: uuidv4(),
        title: "",
        description: "",
        type: ProcessType.ONBOARDING,
        status: ProcessStatus.OPEN,
        tasks: [],
        industries: [],
        history: [],
        createdAt: new Date(),
        creator: "currentUser",
      };
      return { ...base, ...patch };
    });
  };

  // wenn Nutzer tippt: update lokal + Context sofort (Header live)
  const onTitleChange = (v: string) => {
    setTitle(v);
    updateDraft({ title: v });
  };

  const onDescriptionChange = (v: string) => {
    setDescription(v);
    updateDraft({ description: v });
  };

  const onTypeChange = (t: ProcessType) => {
    setType(t);
    updateDraft({ type: t });
  };

  const handleNext = () => {
    if (!title.trim()) return;

    // Stelle sicher, dass draftProcess existiert und die aktuellen Werte enthält
    updateDraft({
      title,
      description,
      type,
    });

    // navigate to step-2 (draft ist jetzt im Context)
    navigate("/processes/create/step-2");
  };

  return (
    <div className="flex flex-col gap-2 p-4 sm:p-6">
      <label className="font-medium">Prozessname</label>
      <input
        type="text"
        placeholder="Prozessname"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />

      <label className="font-medium mt-2">Beschreibung</label>
      <textarea
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />

      <label className="font-medium mt-2">Prozesstyp</label>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as ProcessType)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      >
        {Object.values(ProcessType).map((pt) => (
          <option key={pt} value={pt}>
            {pt}
          </option>
        ))}
      </select>

      <h3 className="font-semibold mt-4">Oder Vorlage auswählen:</h3>
      <div className="flex flex-col gap-2 mb-4">
        {processTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => {
              setTitle(tpl.name);
              setDescription("");
              onTypeChange(tpl.type);
              // update draft also
              updateDraft({ title: tpl.name, description: "", type: tpl.type });
            }}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-left w-full"
          >
            {tpl.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!title.trim()}
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 w-full"
      >
        Weiter
      </button>
    </div>
  );
}
