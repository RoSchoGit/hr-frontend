/* // src/components/BaseCard.tsx
import { Component, createRef } from "react";
import { MoreVertical, Pencil, Trash, Info, ChevronDown, ChevronRight } from "lucide-react";
import SmartText from "./SmartText";
import { getCardColors } from "@/features/task/cardColors";
import Button from "./Button";
import type { HasDueAndStatus } from "@/features/task/cardColors";
import "./BaseCard.css";

type BaseCardProps = {
    title: string;
    children: React.ReactNode;
    borderColor?: string;
    dueColor?: string;
    statusColor?: string;
    meta?: HasDueAndStatus;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onInfo?: () => void;
    showDragHandle?: boolean;
    dragHandle?: React.ReactNode;
    dragHandleProps?: any;
    allowEditing?: boolean;
    menuOpen: boolean;
    setMenuOpen?: (open: boolean) => void;
};

type BaseCardState = { expanded: boolean; showTooltip: boolean };

export class BaseCard extends Component<BaseCardProps, BaseCardState> {
    menuRef = createRef<HTMLDivElement>();
    tooltipTimeout?: NodeJS.Timeout;

    state: BaseCardState = { expanded: true, showTooltip: false };

    componentWillUnmount() {
        if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
    }

    toggleTooltip = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.setState({ showTooltip: true }, () => {
            if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(() => this.setState({ showTooltip: false }), 2000);
        });
    };

    toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.setState((prev) => ({ expanded: !prev.expanded }));
    };

    render() {
        const {
            title,
            children,
            borderColor: borderColorProp,
            dueColor: dueColorProp,
            statusColor: statusColorProp,
            meta,
            onClick,
            onEdit,
            onDelete,
            onInfo,
            showDragHandle,
            dragHandle,
            dragHandleProps,
            allowEditing,
            menuOpen,
            setMenuOpen,
        } = this.props;

        const auto = getCardColors(meta);
        const borderColor = borderColorProp ?? auto.borderColor;
        const dueColor = dueColorProp ?? auto.dueColor;
        const statusColor = statusColorProp ?? auto.statusColor;

        const { expanded } = this.state;

        return (
            <div
                onClick={onClick}
                className="base-card"
                style={{ borderColor }}
            >
                <div className="base-card__content">
                    {expanded ? (
                        <SmartText>{children}</SmartText>
                    ) : (
                        <SmartText className="base-card__title">{title}</SmartText>
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
                        onClick={this.toggleExpand}
                        aria-label={expanded ? "Einklappen" : "Aufklappen"}
                    >
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>

                    {expanded && (
                        <>
                            {showDragHandle && <div {...dragHandleProps} className="base-card__drag-handle">{dragHandle}</div>}
                            {allowEditing && (
                                <div className="base-card__menu" ref={this.menuRef}>
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setMenuOpen?.(!menuOpen);
                                        }}
                                        aria-label="Mehr Optionen"
                                    >
                                        <MoreVertical size={16} />
                                    </Button>
                                    {menuOpen && (
                                        <div className="base-card__menu-panel" onClick={(e) => e.stopPropagation()}>
                                            {onEdit && (
                                                <button onClick={onEdit} className="base-card__menu-item base-card__menu-item--edit">
                                                    <Pencil size={14} /> Bearbeiten
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={onDelete} className="base-card__menu-item base-card__menu-item--delete">
                                                    <Trash size={14} /> Löschen
                                                </button>
                                            )}
                                            {onInfo && (
                                                <button onClick={onInfo} className="base-card__menu-item base-card__menu-item--info">
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
}

export default BaseCard;
 */