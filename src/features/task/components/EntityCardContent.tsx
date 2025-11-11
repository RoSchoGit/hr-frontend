import React, { useEffect, useRef, useState } from "react";
import { DueDateUtils } from "@/utils/DueDateUtils";
import { getCardColors } from "../cardColors";
import type { HasDueAndStatus } from "../cardColors";

type BaseEntity = HasDueAndStatus & {
    title: string;
    type?: string | null;
};

/**
 * Generic component for Task / Process / other entities that have title, dueDate, status, type.
 * T allows callers to keep concrete types (Task | Process).
 */
type Props<T extends BaseEntity> = {
    entity: T;
    // handlers typed to the concrete entity
    setDeleteCandidate?: (e: T | null) => void;
    onEdit?: (e: T) => void;
    onInfo?: (e: T) => void;
    // tooltip duration in ms (optional)
    tooltipDuration?: number;
};

export default function EntityCardContent<T extends BaseEntity>({
    entity,
    setDeleteCandidate,
    onEdit,
    onInfo,
    tooltipDuration = 1500,
}: Props<T>) {
    const [showDueTooltip, setShowDueTooltip] = useState(false);
    const tooltipTimeout = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (tooltipTimeout.current) window.clearTimeout(tooltipTimeout.current);
        };
    }, []);

    const showTooltip = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDueTooltip(true);
        if (tooltipTimeout.current) window.clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = window.setTimeout(() => setShowDueTooltip(false), tooltipDuration);
    };

    const { dueColor, dueTextColor, statusColor, statusTextColor } = getCardColors(entity);

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                {entity.type && <p className="text-xs text-text-muted whitespace-nowrap">{entity.type}</p>}
                <div className="flex flex-wrap gap-2">
                    {entity.dueDate && (
                        <div
                            className="relative text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                            style={{ backgroundColor: dueColor, color: dueTextColor }}
                            onClick={showTooltip}
                            onMouseEnter={showTooltip}
                        >
                            {DueDateUtils.formattedDate(entity.dueDate)}
                            {showDueTooltip && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                                    {DueDateUtils.dueText(entity.dueDate)}
                                </div>
                            )}
                        </div>
                    )}

                    {entity.status && (
                        <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                            style={{ backgroundColor: statusColor, color: statusTextColor }}
                        >
                            {entity.status.replace("_", " ")}
                        </span>
                    )}
                </div>
            </div>

            <h3 className="font-semibold text-gray-900">{entity.title}</h3>
        </>
    );
}
