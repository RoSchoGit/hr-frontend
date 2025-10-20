import React from "react";

interface EmptyStateProps {
    title: string;              // z. B. "Prozess nicht gefunden"
    message: string;            // z. B. "Der angeforderte Prozess existiert nicht oder wurde gelöscht."
    icon?: React.ReactNode;     // optional eigenes Icon
    height?: string;            // z. B. "h-[60vh]" oder "h-full"
}

/**
 * Universelle Komponente für "leere" oder "nicht gefundene" Zustände.
 * Ideal für Prozesse, Tasks, oder generische Fehlermeldungen.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon,
    height = "h-[60vh]",
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center ${height} text-center text-gray-600`}
        >
            {icon ?? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 13h6m-3-3v6m-7 8h14a2 2 0 002-2V7l-6-6H5a2 2 0 00-2 2v16a2 2 0 002 2z"
                    />
                </svg>
            )}

            <h2 className="text-lg font-semibold mb-1">{title}</h2>
            <p className="text-sm text-gray-500">{message}</p>
        </div>
    );
};

export default EmptyState;
