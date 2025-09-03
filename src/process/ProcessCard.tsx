import { Component } from "react";
import type { Process } from "@/process/Process";
import { StatusUtils } from "@/utils/StatusUtils";
import { DueDateUtils } from "@/utils/DueDateUtils";
import { BaseCard } from "@/components/BaseCard";
import type { Task } from "@/task/Task";

type ProcessCardProps = {
  process: Process;
  handleClick: (process: Process) => void;
  setDeleteCandidate: (process: Process | null) => void;
  onEdit?: (process: Process) => void;
  onInfo?: (process: Process) => void;
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
};

type ProcessCardState = {
  showDueTooltip: boolean;
};

export class ProcessCard extends Component<ProcessCardProps, ProcessCardState> {
  tooltipTimeout?: NodeJS.Timeout;

  constructor(props: ProcessCardProps) {
    super(props);
    this.state = { showDueTooltip: false };
  }

  componentWillUnmount() {
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
  }

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
    const { process, handleClick, setDeleteCandidate, onEdit, onInfo, menuOpen, setMenuOpen } =
      this.props;

    const { showDueTooltip } = this.state;

    const status = StatusUtils.getStatusColor(process.status);
    const dueColor = DueDateUtils.dueColors(process.dueDate);

    const getMaxTaskDueDate = (tasks?: Task[]): Date | undefined => {
      if (!tasks || tasks.length === 0) return undefined;

      const dates = tasks
        .map((t) => t.dueDate ? new Date(t.dueDate) : undefined)
        .filter((d): d is Date => d !== undefined) // TypeScript weiß jetzt: alles Date
        .sort((a, b) => b.getTime() - a.getTime());

      return dates[0];
    };

    const dueDateToShow: Date | undefined = process.dueDate ? new Date(process.dueDate) : getMaxTaskDueDate(process.tasks);

    return (
      <BaseCard
        title={process.title}
        borderColor={status.border}
        onClick={() => handleClick(process)}
        onEdit={() => onEdit?.(process)}
        onDelete={() => setDeleteCandidate(process)}
        onInfo={() => onInfo?.(process)}
        allowEditing={true}
        menuOpen={menuOpen ?? false}
        setMenuOpen={setMenuOpen}
        dueColor={dueColor.bg}  
        statusColor={status.bg}    
      >
        <div className="flex flex-wrap items-center gap-2">
          {process.type && (
            <p className="text-xs text-gray-500 whitespace-nowrap">{process.type}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {dueDateToShow && (
              <div
                className="relative text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                style={{ backgroundColor: dueColor.bg, color: dueColor.text }}
                onClick={this.showTooltip}
                onMouseEnter={this.showTooltip}
              >
                {DueDateUtils.formattedDate(dueDateToShow)}
                {showDueTooltip && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                    {DueDateUtils.dueText(dueDateToShow)}
                  </div>
                )}
              </div>
            )}
            {process.status && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                style={{ backgroundColor: status.bg, color: status.text }}
              >
                {process.status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900">{process.title}</h3>
      </BaseCard>
    );
  }
}

export default ProcessCard;
