import { Component } from "react";
import EntityCardContent from "./EntityCardContent";
import { BaseCard } from "@/components/BaseCard";
import type { Task } from "../Task";

type TaskCardProps = {
  task: Task;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onEdit?: (task: Task) => void;
  onInfo?: (task: Task) => void;
  onClick?: () => void;
  setDeleteCandidate?: (task: Task) => void;
  showReorderButtons?: boolean;
  dragHandle?: React.ReactNode;
  allowEditing?: boolean;
};
export class TaskCard extends Component<any, any> {
  render() {
    const { task, setDeleteCandidate, onEdit, onInfo, onClick, menuOpen, setMenuOpen } = this.props;

    return (
      <BaseCard
        title={task.title}
        meta={task}
        onClick={onClick}
        onEdit={() => onEdit?.(task)}
        onDelete={() => setDeleteCandidate?.(task)}
        onInfo={() => onInfo?.(task)}
        showDragHandle={this.props.showReorderButtons ?? false}
        dragHandle={this.props.dragHandle ?? false}
        dragHandleProps={this.props.dragHandleProps ?? {}}
        allowEditing={this.props.allowEditing ?? false}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        <EntityCardContent entity={task} />
      </BaseCard>
    );
  }
}

export default TaskCard;
