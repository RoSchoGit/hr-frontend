import { useNavigate } from "react-router-dom";
import useProcessStore from "../../../features/process/store/useProcessStore";
import { useTaskStore } from "@/features/task/store/useTaskStore";
import TaskCard from "@/features/task/components/TaskCard";
import { createProcess } from "../../../features/process/api/processApi";
import { createTask } from "@/features/task/api/taskApi";

export default function CreateStep3() {
    const process = useProcessStore.getState().selectedProcess;
    const tasks = useTaskStore((state) =>
        process ? state.getTasksForProcess(process.id) : []
    );
    const navigate = useNavigate();

    console.log(process);

    tasks.forEach(task => console.log(task));

    function serializeProcess(process: any) {
        return {
            id: process.id,
            title: process.title,
            description: process.description,
            type: process.type,
            status: process.status,
            creator: process.creator,
            // nur ISO-Strings senden, nicht JS-Date
            createdAt: process.createdAt ? process.createdAt.toISOString() : null,
            completedAt: process.completedAt ? process.completedAt.toISOString() : null,
            dueDate: process.dueDate ? process.dueDate.toISOString() : null,
            // industries als JSON-String, falls gesetzt
            industriesJson: process.industries?.length
                ? JSON.stringify(process.industries)
                : null,
            // metadata als JSON-String, falls gesetzt
            metadataJson: process.metadata ? JSON.stringify(process.metadata) : null,
        };
    }

    function serializeTask(task: any, processId: string) {
        return {
            id: task.id,
            processId: processId,
            title: task.title,
            description: task.description,
            type: task.type,
            status: task.status,
            creator: task.creator,
            assignee: task.assignee,
            position: task.position,
            createdAt: task.createdAt ? task.createdAt.toISOString() : null,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            completedAt: task.completedAt ? task.completedAt.toISOString() : null,
            metadataJson: task.metadata ? JSON.stringify(task.metadata) : null,
        };
    }

    const handleSubmit = async () => {
        if (!process) return;
      
        try {
          // Prozess serialisieren
          const savedProcess = await createProcess(serializeProcess(process));
      
          // Tasks serialisieren
          await Promise.all(tasks.map((t) => createTask(serializeTask(t, savedProcess.id))));
      
          navigate("/processes");
        } catch (err) {
          console.error("Fehler beim Erstellen:", err);
          alert("Es gab ein Problem beim Erstellen des Prozesses");
        }
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
