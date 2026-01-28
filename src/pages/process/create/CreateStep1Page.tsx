import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { Process } from "@/features/process/Process";
import { ProcessStatus, ProcessType } from "@/features/process/Process";
import "./CreateStep1Page.css";

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

  const [title, setTitle] = useState<string>(draftProcess?.title ?? "");
  const [description, setDescription] = useState<string>(draftProcess?.description ?? "");
  const [type, setType] = useState<ProcessType>((draftProcess?.type as ProcessType) ?? ProcessType.ONBOARDING);

  useEffect(() => {
    setTitle(draftProcess?.title ?? "");
    setDescription(draftProcess?.description ?? "");
    setType((draftProcess?.type as ProcessType) ?? ProcessType.ONBOARDING);
  }, [draftProcess]);

  const updateDraft = (patch: Partial<Process>) => {
    setDraftProcess((prev) => {
      const base: Process = prev ?? {
        id: uuidv4(),
        title: "",
        description: "",
        type: ProcessType.ONBOARDING,
        status: ProcessStatus.OPEN,
        industries: [],
        createdAt: "currentDate",
        creator: "currentUser",
      };
      return { ...base, ...patch };
    });
  };

  const onTitleChange = (v: string) => { setTitle(v); updateDraft({ title: v }); };
  const onDescriptionChange = (v: string) => { setDescription(v); updateDraft({ description: v }); };
  const onTypeChange = (t: ProcessType) => { setType(t); updateDraft({ type: t }); };

  const handleNext = () => {
    if (!title.trim()) return;
    updateDraft({ title, description, type });
    navigate("/processes/create/step-2");
  };

  return (
    <div className="create-step1">
      <label>Prozessname</label>
      <input
        type="text"
        placeholder="Prozessname"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />

      <label>Beschreibung</label>
      <textarea
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <label>Prozesstyp</label>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as ProcessType)}
      >
        {Object.values(ProcessType).map((pt) => (
          <option key={pt} value={pt}>{pt}</option>
        ))}
      </select>

      <h3>Oder Vorlage auswählen:</h3>
      <div className="template-list">
        {processTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => {
              setTitle(tpl.name);
              setDescription("");
              onTypeChange(tpl.type);
              updateDraft({ title: tpl.name, description: "", type: tpl.type });
            }}
            className="template-button"
          >
            {tpl.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!title.trim()}
        className="next-button"
      >
        Weiter
      </button>
    </div>
  );
}
