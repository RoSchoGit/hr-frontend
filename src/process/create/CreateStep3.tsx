import { useOutletContext, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

type ContextType = {
    processName: string;
    tasks: any[];
};

export default function CreateStep3() {
    const { processName, tasks } = useOutletContext<ContextType>();
    const navigate = useNavigate();

    const handleSubmit = () => {
        // API Call hier einfügen
        console.log("Prozess speichern:", { processName, tasks });
        navigate("/processes");
    };

    return (
        <>
            <h2 className="text-lg font-bold mb-4">Zusammenfassung</h2>
            <p className="mb-2">Prozessname: {processName}</p>
            <p className="mb-4">Tasks: {tasks.length}</p>

            <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
            >
                Prozess erstellen
            </button>
        </>
    );
}
