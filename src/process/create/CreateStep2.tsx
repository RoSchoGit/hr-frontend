import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskImpl } from "@/task/Task";
import TaskList from "@/task/TaskList";
import { useTaskStore } from "@/task/useTaskStore";
import useProcessStore from "../useProcessStore";

type ContextType = {
    processName: string;
};

export default function CreateStep2() {
    const { processName } = useOutletContext<ContextType>();
    const navigate = useNavigate();

    const { tasks, addTask: addTaskToStore, moveTask, setDeleteCandidate } =
        useTaskStore();

    const selectedProcess = useProcessStore((state) => state.selectedProcess);

    const effectiveProcessName = processName || selectedProcess?.title || "Details";

    const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "" });

    const addTask = () => {
        if (!newTask.title.trim()) return;
        const task = new TaskImpl(
            uuidv4(),
            "DEFAULT",
            newTask.title,
            newTask.description,
            "currentUser",
            newTask.assignee || "Unassigned",
            new Date()
        );
        addTaskToStore(task);
        setNewTask({ title: "", description: "", assignee: "" });
    };

    return (
        <>
            <TaskList
                processName={effectiveProcessName}
                tasks={tasks}
                setDeleteCandidate={setDeleteCandidate}
                showReorderButtons
                allowEditing
                onMoveTask={moveTask}
            />

            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
                <input
                    type="text"
                    placeholder="Task Titel"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Beschreibung"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                />

                <button
                    onClick={addTask}
                    className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                >
                    + Task hinzufügen
                </button>
            </div>

            <button
                onClick={() => navigate("/processes/create/step-3")}
                disabled={tasks.length === 0}
                className={`px-4 py-2 rounded text-white ${tasks.length ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Weiter
            </button>
        </>
    );
}
