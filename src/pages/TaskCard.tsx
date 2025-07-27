import { Link } from "react-router-dom";
import type { Task } from "@/models/Task";
import { TaskStatus } from "@/models/Task";
import { useSwipeable } from "react-swipeable";

type TaskCardProps = {
    task: Task;
    handleTaskClick: (task: Task) => void;
    setDeleteCandidate: (task: Task) => void;
  };
  
  const TaskCard = ({ task, handleTaskClick, setDeleteCandidate }: TaskCardProps) => {
    const handlers = useSwipeable({
      onSwipedLeft: () => setDeleteCandidate(task),
      onSwipedRight: () => setDeleteCandidate(task),
      preventScrollOnSwipe: true,
      trackMouse: true,
    });

    return (
        <Link key={task.id} to={`/tasks/${task.id}`}>
            <div
                {...handlers}
                onClick={() => handleTaskClick(task)}
                className="p-3 border rounded-lg shadow active:bg-gray-50 transition duration-200 cursor-pointer"
            >
                <p className="text-xs text-gray-500">{task.type}</p>
                <h3 className="font-semibold">{task.title}</h3>
                <p
                    className={`text-sm ${task.status === TaskStatus.OPEN
                        ? "text-green-600"
                        : task.status === TaskStatus.IN_PROGRESS
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                >
                    {task.status}
                </p>
            </div>
        </Link>
    );
};

export default TaskCard;
