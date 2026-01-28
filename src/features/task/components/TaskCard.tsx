import { Component } from "react";
import EntityBaseCard from "@/components/EntityBaseCard";

export class TaskCard extends Component<any, any> {
  render() {
    const { task, setDeleteCandidate, onEdit, onInfo, onClick, menuOpen, setMenuOpen } = this.props;

    return (
      <EntityBaseCard
        title={task.title}
        entity={task}
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
      />
    );
  }
}

export default TaskCard;
