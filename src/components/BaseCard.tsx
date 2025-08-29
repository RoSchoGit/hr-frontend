import { Component, createRef } from "react";
import { MoreVertical, Pencil, Trash, Info } from "lucide-react";

type BaseCardProps = {
    children: React.ReactNode; // Linke Spalte wird von außen gefüllt
    borderColor?: string;
    onClick?: () => void;

    // Menü
    onEdit?: () => void;
    onDelete?: () => void;
    onInfo?: () => void;

    // Drag
    showDragHandle?: boolean;
    dragHandle?: React.ReactNode;
    dragHandleProps?: any;
    allowEditing?: boolean;
    menuOpen: boolean;
    setMenuOpen?: (open: boolean) => void;
};

export class BaseCard extends Component<BaseCardProps> {
    menuRef = createRef<HTMLDivElement>();

    render() {
        const {
            children,
            borderColor,
            onClick,
            onEdit,
            onDelete,
            onInfo,
            showDragHandle,
            dragHandle,
            dragHandleProps,
            allowEditing,
            menuOpen,
            setMenuOpen
        } = this.props;

        return (
            <div
                onClick={onClick}
                className="p-3 border-2 rounded-lg shadow-md bg-white cursor-pointer select-none hover:shadow-lg transition-shadow flex"
                style={{ borderColor }}
            >
                {/* Linke Spalte */}
                <div className="flex-1 flex flex-col gap-1">{children}</div>

                {/* Rechte Spalte */}
                {(showDragHandle || allowEditing) && (
                    <div className="flex flex-col items-end ml-3 space-y-2 flex-shrink-0">
                        {showDragHandle && (
                            <div {...dragHandleProps} className="cursor-grab">
                                {dragHandle}
                            </div>
                        )}

                        {allowEditing && (
                            <div className="relative" ref={this.menuRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setMenuOpen?.(!menuOpen);
                                    }}
                                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                                    aria-label="Mehr Optionen"
                                    style={{ pointerEvents: "auto" }}
                                >
                                    <MoreVertical size={16} />
                                </button>
                                {menuOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {onEdit && (
                                            <button
                                                onClick={onEdit}
                                                className="flex items-center w-full px-2 py-1 hover:bg-gray-100 text-blue-600 transition-colors"
                                            >
                                                <Pencil size={14} className="mr-1" /> Bearbeiten
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={onDelete}
                                                className="flex items-center w-full px-2 py-1 hover:bg-gray-100 text-red-600 transition-colors"
                                            >
                                                <Trash size={14} className="mr-1" /> Löschen
                                            </button>
                                        )}
                                        {onInfo && (
                                            <button
                                                onClick={onInfo}
                                                className="flex items-center w-full px-2 py-1 hover:bg-gray-100 text-gray-800 transition-colors"
                                            >
                                                <Info size={14} className="mr-1" /> Info
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
