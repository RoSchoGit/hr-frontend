import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTaskStore } from "@/features/task/store/useTaskStore";

export default function CreateProcessLayout() {
    const navigate = useNavigate();
    const { step } = useParams<{ step?: string }>();

    const [processName, setProcessName] = useState("");
    const {setTasks } = useTaskStore();

    // Falls man direkt auf /step-2 landet ohne Prozessname, zurück zu Step 1
    useEffect(() => {
        if (!processName && step === "step-2") {
            navigate("/processes/create/step-1");
        }
    }, [processName, step, navigate]);

    return (
        <div className="max-w-sm mx-auto font-sans">
            <Outlet
                context={{
                    processName,
                    setProcessName,
                    setTasks
                }}
            />
        </div>
    );
}
