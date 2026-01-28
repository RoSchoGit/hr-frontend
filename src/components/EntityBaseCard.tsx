// src/components/EntityBaseCard.tsx
import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash, Info, ChevronDown, ChevronRight } from "lucide-react";
import SmartText from "./SmartText";
import Button from "./Button";
import { DueDateUtils } from "@/utils/DueDateUtils";
import { getCardColors } from "@/features/task/cardColors";
import type { HasDueAndStatus } from "@/features/task/cardColors";
import "./EntityBaseCard.css";

type BaseEntity = HasDueAndStatus & {
  id?: string | number;
  title: string;
  type?: string | null;
};

type Props<T extends BaseEntity> = {
  entity: T;
  title?: string;
  // BaseCard-like props
  borderColor?: string;
  dueColor?: string;
  statusColor?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onInfo?: () => void;
  showDragHandle?: boolean;
  dragHandle?: React.ReactNode;
  dragHandleProps?: any;
  allowEditing?: boolean;
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
  // tooltip control for due date
  tooltipDuration?: number;
  // optionally collapse initially
  defaultExpanded?: boolean;
};

export default function EntityBaseCard<T extends BaseEntity>({
  entity,
  title,
  borderColor: borderColorProp,
  dueColor: dueColorProp,
  statusColor: statusColorProp,
  onClick,
  onEdit,
  onDelete,
  onInfo,
  showDragHandle,
  dragHandle,
  dragHandleProps,
  allowEditing,
  menuOpen = false,
  setMenuOpen,
  tooltipDuration = 1500,
  defaultExpanded = true,
}: Props<T>) {
  // expand state (was in BaseCard class)
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  // tooltip for due-date (was in EntityCardContent)
  const [showDueTooltip, setShowDueTooltip] = useState(false);
  const dueTooltipTimeout = useRef<number | null>(null);
  // a general tooltip used by BaseCard wasn't actually used visibly besides due tooltip — so we omit it.
  // cleanup
  useEffect(() => {
    return () => {
      if (dueTooltipTimeout.current) window.clearTimeout(dueTooltipTimeout.current);
    };
  }, []);

  const toggleExpand = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded((s) => !s);
  };

  const showDue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDueTooltip(true);
    if (dueTooltipTimeout.current) window.clearTimeout(dueTooltipTimeout.current);
    dueTooltipTimeout.current = window.setTimeout(() => setShowDueTooltip(false), tooltipDuration);
  };

  const auto = getCardColors(entity as HasDueAndStatus | undefined);
  const borderColor = borderColorProp ?? auto.borderColor;
  const dueColor = dueColorProp ?? auto.dueColor;
  const statusColor = statusColorProp ?? auto.statusColor;

  // badge text colors from getCardColors (if you have those names)
  const { dueTextColor, statusTextColor } = (getCardColors as any)(entity) || {};

  return (
    <div onClick={onClick} className="base-card" style={{ borderColor }}>
      <div className="base-card__content">
        {expanded ? (
          // full content (previous EntityCardContent)
          <div className="entity-card">
            {entity.type && <p className="entity-card__type">{entity.type}</p>}

            <div className="entity-card__badge-group">
              {entity.dueDate && (
                <div
                  className="entity-card__badge"
                  style={{ backgroundColor: dueColor, color: dueTextColor }}
                  onClick={showDue}
                  onMouseEnter={showDue}
                >
                  {DueDateUtils.formattedDate(entity.dueDate)}
                  {showDueTooltip && (
                    <div className="entity-card__tooltip">
                      {DueDateUtils.dueText(entity.dueDate)}
                    </div>
                  )}
                </div>
              )}

              {entity.status && (
                <span
                  className="entity-card__badge"
                  style={{ backgroundColor: statusColor, color: statusTextColor }}
                >
                  {entity.status.replace("_", " ")}
                </span>
              )}
            </div>

            <SmartText className="entity-card__title">{entity.title}</SmartText>
          </div>
        ) : (
          <SmartText className="entity-card__title">{title ?? entity.title}</SmartText>
        )}
      </div>

      <div className={`base-card__side ${expanded ? "base-card__side--expanded" : "base-card__side--collapsed"}`}>
        {!expanded && (
          <div className="base-card__status-dots">
            {dueColor && <span className="base-card__status-dot" style={{ backgroundColor: dueColor }} />}
            {statusColor && <span className="base-card__status-dot" style={{ backgroundColor: statusColor }} />}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            toggleExpand(e);
          }}
          aria-label={expanded ? "Einklappen" : "Aufklappen"}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Button>

        {expanded && (
          <>
            {showDragHandle && <div {...dragHandleProps} className="base-card__drag-handle">{dragHandle}</div>}
            {allowEditing && (
              <div className="base-card__menu">
                <Button
                  variant="ghost"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setMenuOpen?.(!menuOpen);
                  }}
                  aria-label="Mehr Optionen"
                >
                  <MoreVertical size={16} />
                </Button>
                {menuOpen && (
                  <div className="base-card__menu-panel" onClick={(e) => e.stopPropagation()}>
                    {onEdit && (
                      <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="base-card__menu-item base-card__menu-item--edit">
                        <Pencil size={14} /> Bearbeiten
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="base-card__menu-item base-card__menu-item--delete">
                        <Trash size={14} /> Löschen
                      </button>
                    )}
                    {onInfo && (
                      <button onClick={(e) => { e.stopPropagation(); onInfo(); }} className="base-card__menu-item base-card__menu-item--info">
                        <Info size={14} /> Info
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
