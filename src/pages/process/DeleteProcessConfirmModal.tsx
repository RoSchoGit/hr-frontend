// src/features/task/components/DeleteConfirmModal.tsx
import useProcessStore from "@/features/process/store/useProcessStore";

export default function DeleteProcessConfirmModal() {
    const deleteCandidate = useProcessStore((s) => s.deleteCandidate);
    const deleteSelectedProcess = useProcessStore((s) => s.deleteSelectedProcess);
    const setDeleteCandidate = useProcessStore((s) => s.setDeleteCandidate);

    if (!deleteCandidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Process wirklich löschen?</h3>
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
                                await deleteSelectedProcess();
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
