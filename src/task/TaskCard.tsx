import { Component, createRef } from "react";
import { DueDateUtils } from "@/utils/DueDateUtils";
import type { Task } from "@/task/Task";
import { StatusUtils } from "@/utils/StatusUtils";
import { BaseCard } from "@/components/BaseCard";

type TaskCardProps = {
  task: Task;
  dragHandle?: React.ReactNode;
  dragHandleProps?: any;
  setDeleteCandidate?: (task: Task) => void;
  showReorderButtons?: boolean;
  allowEditing?: boolean;
  onEdit?: (task: Task) => void;
  onInfo?: (task: Task) => void;
  onClick?: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

type TaskCardState = {
  showDueTooltip: boolean;
};

export class TaskCard extends Component<TaskCardProps, TaskCardState> {
  menuRef = createRef<HTMLDivElement>();
  tooltipTimeout?: NodeJS.Timeout;

  constructor(props: TaskCardProps) {
    super(props);
    this.state = { showDueTooltip: false };
  }

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
  }

  handleOutsideClick = (e: MouseEvent) => {
    if (!this.menuRef.current?.contains(e.target as Node)) {
      this.setState({ showDueTooltip: false });
    }
  };

  showTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.setState({ showDueTooltip: true }, () => {
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = setTimeout(() => {
        this.setState({ showDueTooltip: false });
      }, 1500);
    });
  };

  render() {
    const {
      task,
      dragHandle,
      dragHandleProps,
      setDeleteCandidate,
      showReorderButtons = false,
      allowEditing = false,
      onEdit,
      onInfo,
      onClick,
      menuOpen,
      setMenuOpen,
    } = this.props;

    const { showDueTooltip } = this.state;
    const dueColor = DueDateUtils.dueColors(task.dueDate);
    const status = StatusUtils.getStatusColor(task.status);

    return (
      <BaseCard
        title={task.title}
        borderColor={status.border}
        dueColor={dueColor?.bg}
        statusColor={status?.bg}
        onClick={onClick}
        onEdit={() => onEdit?.(task)}
        onDelete={() => setDeleteCandidate?.(task)}
        onInfo={() => onInfo?.(task)}
        showDragHandle={showReorderButtons}
        dragHandle={dragHandle}
        dragHandleProps={dragHandleProps}
        allowEditing={allowEditing}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        {/* Linke Spalte (kommt als children rein) */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-gray-500 whitespace-nowrap">{task.type}</p>
          <div className="flex flex-wrap gap-2">
            {task.dueDate && (
              <div
                className="relative text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                style={{ backgroundColor: dueColor.bg, color: dueColor.text }}
                onClick={this.showTooltip}
                onMouseEnter={this.showTooltip}
              >
                {DueDateUtils.formattedDate(task.dueDate)}
                {showDueTooltip && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                    {DueDateUtils.dueText(task.dueDate)}
                  </div>
                )}
              </div>
            )}
            {task.status && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                style={{ backgroundColor: status.bg, color: status.text }}
              >
                {task.status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        {/* Titel */}
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
      </BaseCard>
    );

  }
}

export default TaskCard;
