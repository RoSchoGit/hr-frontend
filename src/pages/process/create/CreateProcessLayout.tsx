import { Outlet } from "react-router-dom";
import { useState } from "react";
import type { Process } from "@/features/process/Process";
import Header from "@/components/Header";
import "./CreateProcessLayout.css";

export default function CreateProcessLayout() {
    const [draftProcess, setDraftProcess] = useState<Process | null>(null);
    const [tasks, setTasks] = useState<any[]>([]); // Tasks als Array, kann TaskImpl sein

    const title = draftProcess?.title ?? "Neuer Prozess";

    return (
        <div className="create-process-layout">
            <Outlet context={{ draftProcess, setDraftProcess, tasks, setTasks }} />
        </div>
    );
}
