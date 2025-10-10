import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessStore } from "@/features/process/store/useProcessStore";
import { ProcessType } from "@/features/process/Process";

const processTemplates = [
  { id: "p1", name: "Onboarding neuer Mitarbeiter", type: ProcessType.ONBOARDING },
  { id: "p2", name: "Marketing-Kampagne starten", type: ProcessType.PERFORMANCE_REVIEW }
];

export default function CreateStep1() {
  const navigate = useNavigate();
  const createNewProcess = useProcessStore((state) => state.createNewProcess);

  const [processName, setProcessName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProcessType>(ProcessType.ONBOARDING);

  const handleNext = () => {
    if (!processName.trim()) return;
    createNewProcess(processName, description, type);
    navigate("/processes/create/step-2");
  };

  return (
    <div className="flex flex-col gap-2 p-4 sm:p-6">
      <label className="font-medium">Prozessname</label>
      <input
        type="text"
        placeholder="Prozessname"
        value={processName}
        onChange={(e) => setProcessName(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />

      <label className="font-medium">Beschreibung</label>
      <textarea
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />

      <label className="font-medium">Prozesstyp</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as ProcessType)}
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
              setProcessName(tpl.name);
              setType(tpl.type);
            }}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-left w-full"
          >
            {tpl.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!processName.trim()}
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 w-full"
      >
        Weiter
      </button>
    </div>
  );
}
