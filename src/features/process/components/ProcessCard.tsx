// src/features/process/ProcessCard.tsx (angepasst)
import { Component } from "react";
import type { Process } from "@/features/process/Process";
import EntityBaseCard from "@/components/EntityBaseCard";

type ProcessCardProps = {
  process: Process;
  handleClick: (process: Process) => void;
  onDelete?: (process: Process) => void;
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
      this.tooltipTimeout = setTimeout(() => this.setState({ showDueTooltip: false }), 1500);
    });
  };

  render() {
    const { process, handleClick, onDelete, onEdit, onInfo, menuOpen, setMenuOpen } = this.props;

    return (
      <EntityBaseCard
        entity={process}
        title={process.title}
        onClick={() => handleClick(process)}
        onEdit={() => onEdit?.(process)}
        onDelete={() => onDelete?.(process)}
        onInfo={() => onInfo?.(process)}
        allowEditing={true}
        menuOpen={menuOpen ?? false}
        setMenuOpen={setMenuOpen}
      />
    );
  }
}

export default ProcessCard;
