import { useRef, useEffect } from "react";
import useProcessStore from "@/features/process/store/useProcessStore";
import "./DeleteProcessConfirmModal.css";

export default function DeleteProcessConfirmModal() {
  const deleteCandidate = useProcessStore((s) => s.deleteCandidate);
  const deleteSelectedProcess = useProcessStore((s) => s.deleteSelectedProcess);
  const setDeleteCandidate = useProcessStore((s) => s.setDeleteCandidate);

  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Fokus auf Abbrechen-Button, wenn Modal geöffnet
    if (deleteCandidate) {
      cancelRef.current?.focus();
    }
  }, [deleteCandidate]);

  if (!deleteCandidate) return null;

  return (
    <div className="delete-modal__overlay" aria-hidden={false}>
      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-modal-title" className="delete-modal__title">
          Process wirklich löschen?
        </h3>

        <p id="delete-modal-desc" className="delete-modal__body">
          Willst du "{deleteCandidate.title}" wirklich löschen?
        </p>

        <div className="delete-modal__actions">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn--outline"
            onClick={() => setDeleteCandidate(null)}
          >
            Abbrechen
          </button>

          <button
            type="button"
            className="btn btn--danger"
            onClick={async () => {
              try {
                await deleteSelectedProcess();
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
