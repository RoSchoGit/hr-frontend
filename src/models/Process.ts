import type { Task } from "./Task";

export enum ProcessStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export enum ProcessType {
  ONBOARDING = "ONBOARDING",
  LEAVE_REQUEST = "LEAVE_REQUEST",
  HIRE = "HIRE"
}

export interface ProcessHistoryEntry {
  date: Date;
  status: ProcessStatus;
  changedBy: string;
  comment?: string;
}

export interface Process {
  id: string;
  type: string;
  title: string;
  description?: string;
  tasks: Task[];
  status: ProcessStatus;
  creator: string;
  createdAt: Date;
  completedAt?: Date;
  history: ProcessHistoryEntry[];
}

export class ProcessImpl implements Process {
  id: string;
  type: string;
  title: string;
  description?: string;
  tasks: Task[];
  status: ProcessStatus;
  creator: string;
  createdAt: Date;
  completedAt?: Date;
  history: ProcessHistoryEntry[];

  constructor(
    id: string,
    type: string,
    title: string,
    creator: string,
    description?: string
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.description = description;
    this.creator = creator;
    this.status = ProcessStatus.OPEN;
    this.createdAt = new Date();
    this.tasks = [];
    this.history = [];
    this.addHistory(ProcessStatus.OPEN, creator, 'Process created');
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.updateStatus();
  }

  completeTask(taskId: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.complete();
      this.updateStatus();
    }
  }

  setStatus(newStatus: ProcessStatus, changedBy: string, comment?: string) {
    this.status = newStatus;
    if (newStatus === 'DONE') {
      this.completedAt = new Date();
    }
    this.addHistory(newStatus, changedBy, comment);
  }

  private updateStatus() {
    if (this.tasks.every(t => t.status === 'DONE')) {
      this.status = ProcessStatus.OPEN;
      this.completedAt = new Date();
      this.addHistory(ProcessStatus.OPEN, 'SYSTEM', 'All tasks completed');
    } else if (this.tasks.some(t => t.status === 'IN_PROGRESS' || t.status === 'OPEN')) {
      this.status = ProcessStatus.IN_PROGRESS;
    }
  }

  private addHistory(status: ProcessStatus, changedBy: string, comment?: string) {
    this.history.push({
      date: new Date(),
      status,
      changedBy,
      comment
    });
  }
}
