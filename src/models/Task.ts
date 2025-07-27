export enum TaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Task {
  id: string;
  type: string;
  title: string;
  description: string;
  creator: string;
  assignee: string;
  status: TaskStatus;
  dueDate: Date;
  attachments?: Attachment[];
  createdAt: Date;
  completedAt?: Date;
  complete(): void;
}

export class TaskImpl implements Task {
  id: string;
  type: string;
  title: string;
  description: string;
  creator: string;
  assignee: string;
  status: TaskStatus;
  dueDate: Date;
  attachments?: Attachment[];
  createdAt: Date;
  completedAt?: Date;

  constructor(
    id: string,
    type: string,
    title: string,
    description: string,
    creator: string,
    assignee: string,
    dueDate: Date,
    attachments?: Attachment[]
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.description = description;
    this.creator = creator;
    this.assignee = assignee;
    this.status = TaskStatus.OPEN;
    this.dueDate = dueDate;
    this.attachments = attachments;
    this.createdAt = new Date();
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
