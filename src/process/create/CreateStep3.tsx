import { useNavigate } from "react-router-dom";
import useProcessStore from "../useProcessStore";
import { useTaskStore } from "@/task/useTaskStore";
import TaskCard from "@/task/TaskCard";

export default function CreateStep3() {
    const process = useProcessStore.getState().selectedProcess;
    const tasks = useTaskStore((state) =>
        process ? state.getTasksForProcess(process.id) : []
    );
    const navigate = useNavigate();

    const handleSubmit = () => {
        // API Call hier einfügen
        navigate("/processes");
    };

    if (!process) {
        return <div className="p-4 text-red-500">Prozess nicht gefunden.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">
                Zusammenfassung: {process.title}
            </h2>
            <p className="mb-2">Anzahl Tasks: {tasks.length}</p>

            <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        menuOpen={false}
                        setMenuOpen={() => { }}
                        allowEditing={false}
                        showReorderButtons={false}
                    />
                ))}
            </div>

            <button
                onClick={handleSubmit}
                className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
                Prozess erstellen
            </button>
        </div>
    );
}
