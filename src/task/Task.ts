import type { Metadata } from "../process/Process";

export enum TaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export enum TaskType {
  ADMINISTRATION = "ADMINISTRATION",
  DOCUMENTATION = "DOCUMENTATION",
  TRAINING = "TRAINING",
  EQUIPMENT_HANDOVER = "EQUIPMENT_HANDOVER",
  MEETING = "MEETING",
  OTHER = "OTHER"
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Task {
  id: string;
  processId: string; // neu: kommt jetzt direkt aus der DB
  type: TaskType;
  title: string;
  description: string;
  creator: string;
  assignee: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  metadata?: Metadata;
  position: number; // neu für Sortierung
  attachments?: Attachment[];

  complete(): void;
  setStatus(newStatus: TaskStatus): void;
}

export class TaskImpl implements Task {
  id: string;
  processId: string;
  type: TaskType;
  title: string;
  description: string;
  creator: string;
  assignee: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  metadata?: Metadata;
  position: number;
  attachments?: Attachment[];

  constructor(
    id: string,
    processId: string,
    type: TaskType,
    title: string,
    description: string,
    creator: string,
    assignee: string,
    dueDate: Date,
    position: number,
    attachments?: Attachment[],
    metadata?: Metadata
  ) {
    this.id = id;
    this.processId = processId;
    this.type = type;
    this.title = title;
    this.description = description;
    this.creator = creator;
    this.assignee = assignee;
    this.status = TaskStatus.OPEN;
    this.dueDate = dueDate;
    this.createdAt = new Date();
    this.position = position;
    this.attachments = attachments;
    this.metadata = metadata;
  }

  complete() {
    this.status = TaskStatus.DONE;
    this.completedAt = new Date();
  }

  setStatus(newStatus: TaskStatus) {
    this.status = newStatus;
    if (newStatus === TaskStatus.DONE) {
      this.completedAt = new Date();
    }
  }
}
