import React from "react";
import "./EmptyState.css";

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
    height?: "60vh" | "full";
}

/**
 * Universelle Komponente für leere / nicht gefundene Zustände
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon,
    height = "60vh",
}) => {
    return (
        <div className={`empty-state empty-state--${height}`}>
            {icon ?? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="empty-state__icon"
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

            <h2 className="empty-state__title">{title}</h2>
            <p className="empty-state__message">{message}</p>
        </div>
    );
};

export default EmptyState;
