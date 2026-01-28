// src/features/task/components/DeleteTaskConfirmModal.tsx
import { useTaskStore } from "@/features/task/store/useTaskStore";
import "./DeleteTaskConfirmModal.css";

export default function DeleteTaskConfirmModal() {
    const deleteCandidate = useTaskStore((s) => s.deleteCandidate);
    const deleteSelectedTask = useTaskStore((s) => s.deleteSelectedTask);
    const setDeleteCandidate = useTaskStore((s) => s.setDeleteCandidate);

    if (!deleteCandidate) return null;

    return (
        <div className="delete-task-modal__overlay">
            <div className="delete-task-modal__dialog">
                <h3 className="delete-task-modal__title">
                    Task wirklich löschen?
                </h3>

                <p className="delete-task-modal__text">
                    Willst du "{deleteCandidate.title}" wirklich löschen?
                </p>

                <div className="delete-task-modal__actions">
                    <button
                        className="delete-task-modal__btn delete-task-modal__btn--cancel"
                        onClick={() => setDeleteCandidate(null)}
                    >
                        Abbrechen
                    </button>

                    <button
                        className="delete-task-modal__btn delete-task-modal__btn--delete"
                        onClick={async () => {
                            try {
                                await deleteSelectedTask();
                                setDeleteCandidate(null);
                            } catch (err) {
                                console.error("Fehler beim Löschen:", err);
                            }
                        }}
                    >
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    );
}
