import { useOutletContext, useNavigate } from "react-router-dom";

type ContextType = {
  processName: string;
  setProcessName: (name: string) => void;
};

const processTemplates = [
  { id: "p1", name: "Onboarding neuer Mitarbeiter" },
  { id: "p2", name: "Marketing-Kampagne starten" }
];

export default function CreateStep1() {
  const { processName, setProcessName } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  return (
    <>
      <input
        type="text"
        placeholder="Prozessname"
        value={processName}
        onChange={(e) => setProcessName(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
      />

      <h3 className="font-semibold mb-2">Oder Vorlage auswählen:</h3>
      <div className="flex flex-col gap-2 mb-4">
        {processTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setProcessName(tpl.name)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-left"
          >
            {tpl.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("/processes/create/step-2")}
        disabled={!processName.trim()}
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
      >
        Weiter
      </button>
    </>
  );
}
