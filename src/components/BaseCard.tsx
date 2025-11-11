// src/components/BaseCard.tsx
import { Component, createRef } from "react";
import { MoreVertical, Pencil, Trash, Info, ChevronDown, ChevronRight } from "lucide-react";
import SmartText from "./SmartText";
import { getCardColors } from "@/features/task/cardColors";
import type { HasDueAndStatus } from "@/features/task/cardColors";

type BaseCardProps = {
    title: string;
    children: React.ReactNode;
    borderColor?: string;
    dueColor?: string;
    statusColor?: string;

    // neu: meta kann Task oder Process sein (nur fields dueDate + status werden verwendet)
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
        const dueTextColor = auto.dueTextColor;
        const statusTextColor = auto.statusTextColor;

        const { expanded } = this.state;

        return (
            <div
                onClick={onClick}
                className="flex border-2 rounded-lg shadow-md bg-white cursor-pointer select-none hover:shadow-lg transition-shadow"
                style={{ borderColor }}
            >
                <div className="flex-1 min-w-0 p-2 flex flex-col gap-1">
                    {expanded ? <SmartText>{children}</SmartText> : <SmartText className="truncate font-medium w-full block">{title}</SmartText>}
                </div>

                <div className={`flex ${expanded ? "flex-col items-center space-y-1 basis-auto shrink-0 px-1 py-1" : "flex-row items-center space-x-1 basis-auto shrink-0 px-2 py-2"}`}>
                    {!expanded && (
                        <div className="flex flex-col items-center space-y-1">
                            {dueColor && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dueColor }} />}
                            {statusColor && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />}
                        </div>
                    )}

                    <button type="button" onClick={this.toggleExpand} className="p-0.5 rounded hover:bg-surface transition-colors" aria-label={expanded ? "Einklappen" : "Aufklappen"}>
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {expanded && (
                        <>
                            {showDragHandle && <div {...dragHandleProps} className="cursor-grab">{dragHandle}</div>}
                            {allowEditing && (
                                <div className="relative" ref={this.menuRef}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setMenuOpen?.(!menuOpen);
                                        }}
                                        className="p-0.5 rounded hover:bg-surface transition-colors"
                                        aria-label="Mehr Optionen"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    {menuOpen && (
                                        <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10" onClick={(e) => e.stopPropagation()}>
                                            {onEdit && <button onClick={onEdit} className="flex items-center w-full px-2 py-1 hover:bg-surface text-blue-600 transition-colors"><Pencil size={14} className="mr-1" /> Bearbeiten</button>}
                                            {onDelete && <button onClick={onDelete} className="flex items-center w-full px-2 py-1 hover:bg-surface text-red-600 transition-colors"><Trash size={14} className="mr-1" /> Löschen</button>}
                                            {onInfo && <button onClick={onInfo} className="flex items-center w-full px-2 py-1 hover:bg-surface text-gray-800 transition-colors"><Info size={14} className="mr-1" /> Info</button>}
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
