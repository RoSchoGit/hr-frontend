import type { Task } from "@/models/Task";
import { useSwipeable } from "react-swipeable";
import { useTaskStore } from "@/stores/useTaskStore";
import { useEffect, useRef } from "react";
import TaskCard from "@/pages/TaskCard";


const TaskList = () => {
    const {
        tasks,
        selectedTask,
        deleteCandidate,
        selectTask,
        setDeleteCandidate,
        loadTasks
    } = useTaskStore();

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const endRef = useRef<HTMLDivElement>(null);

    // ⬇️ Scroll beim Mount und bei task-Änderung an's Ende
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [tasks.length]);

    const handleTaskClick = (task: Task) => {
        selectTask(task);
    };

    const handleDeleteTask = () => {
        console.log(`Task gelöscht: ${deleteCandidate?.title}`);
        setDeleteCandidate(null);
    };

    return (
        <div className="flex flex-col justify-end min-h-full p-4 gap-1 border-2 border-violet-500">
            {tasks.map((task) => {
                return (
                    <TaskCard
                        key={task.id} // <-- wichtig: ein eindeutiges key-Attribut
                        task={task}
                        handleTaskClick={handleTaskClick}
                        setDeleteCandidate={handleDeleteTask} />
                );
            })}

            {/* Unsichtbares div ans Ende setzen */}
            <div ref={endRef}></div>

            {/* Delete-Dialog bleibt unverändert */}
            {deleteCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Prozess löschen?</h2>
                        <p className="mb-4">
                            Möchtest du <strong>{deleteCandidate.title}</strong> wirklich
                            löschen?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setDeleteCandidate(null)}
                            >
                                Abbrechen
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={handleDeleteTask}
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
