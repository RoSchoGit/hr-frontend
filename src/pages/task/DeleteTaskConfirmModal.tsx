// src/features/task/components/DeleteConfirmModal.tsx
import { useTaskStore } from "@/features/task/store/useTaskStore";

export default function DeleteTaskConfirmModal() {
    const deleteCandidate = useTaskStore((s) => s.deleteCandidate);
    const deleteSelectedTask = useTaskStore((s) => s.deleteSelectedTask);
    const setDeleteCandidate = useTaskStore((s) => s.setDeleteCandidate);

    if (!deleteCandidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Task wirklich löschen?</h3>
                <p className="mb-4">Willst du "{deleteCandidate.title}" wirklich löschen?</p>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-2 rounded border"
                        onClick={() => setDeleteCandidate(null)}
                    >
                        Abbrechen
                    </button>

                    <button
                        className="px-3 py-2 rounded bg-red-600 text-white"
                        onClick={async () => {
                            try {
                                // erst hier löschen
                                await deleteSelectedTask();
                                // sicherstellen, dass Kandidat weg ist
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
