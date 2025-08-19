import type { Task } from "../task/Task";

// Prozessstatus
export enum ProcessStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED"
}

// Prozessarten (generisch, kann erweitert werden)
export enum ProcessType {
  ONBOARDING = "ONBOARDING",
  LEAVE_REQUEST = "LEAVE_REQUEST",
  HIRE = "HIRE",
  TERMINATION = "TERMINATION",
  TRAINING = "TRAINING",
  PERFORMANCE_REVIEW = "PERFORMANCE_REVIEW"
}

// Branchen – bewusst generisch & hierarchisch gedacht
export enum Industry {
  GENERAL_SERVICES = "GENERAL_SERVICES",        // z.B. Reinigung, Callcenter
  HANDWERK = "HANDWERK",                        // z.B. Maler, Elektriker, Friseur
  RETAIL = "RETAIL",                            // z.B. Einzelhandel, Modegeschäft
  GASTRONOMY = "GASTRONOMY",                    // z.B. Restaurant, Café, Imbiss
  HEALTHCARE = "HEALTHCARE",                    // z.B. Arztpraxis, Zahnarzt, Physiotherapie
  LEGAL = "LEGAL",                              // z.B. Anwaltskanzlei, Notariat
  CONSULTING = "CONSULTING",                    // z.B. Unternehmensberatung
  EDUCATION = "EDUCATION",                      // z.B. Nachhilfe, Sprachschule
  CONSTRUCTION = "CONSTRUCTION",                // z.B. Bauunternehmen, Maurerbetrieb
  TRANSPORT_LOGISTICS = "TRANSPORT_LOGISTICS",  // z.B. Spedition, Kurierdienst
  IT_SERVICES = "IT_SERVICES"                   // z.B. Softwareentwicklung, IT-Support
}

// Flexible Zusatzinfos
export interface Metadata {
  [key: string]: string | number | boolean | string[] | number[] | null;
}

// Prozess-Historie
export interface ProcessHistoryEntry {
  date: Date;
  status: ProcessStatus;
  changedBy: string;
  comment?: string;
}

// Haupt-Prozessinterface
export interface Process {
  id: string;
  type: ProcessType;
  title: string;
  description?: string;
  industries: Industry[];
  tasks: Task[];
  status: ProcessStatus;
  creator: string;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  history: ProcessHistoryEntry[];
  metadata?: Metadata;
}

// Implementierung
export class ProcessImpl implements Process {
  id: string;
  type: ProcessType;
  title: string;
  description?: string;
  industries: Industry[];
  tasks: Task[];
  status: ProcessStatus;
  creator: string;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  history: ProcessHistoryEntry[];
  metadata?: Metadata;

  constructor(
    id: string,
    type: ProcessType,
    title: string,
    creator: string,
    industries: Industry[] = [Industry.GENERAL_SERVICES],
    description?: string,
    metadata?: Metadata,
    dueDate?: Date 
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.description = description;
    this.creator = creator;
    this.industries = industries;
    this.status = ProcessStatus.OPEN;
    this.createdAt = new Date();
    this.tasks = [];
    this.history = [];
    this.metadata = metadata;
    this.dueDate = dueDate;
    this.addHistory(ProcessStatus.OPEN, creator, "Process created");
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
    if (newStatus === ProcessStatus.DONE) {
      this.completedAt = new Date();
    }
    this.addHistory(newStatus, changedBy, comment);
  }

  private updateStatus() {
    if (this.tasks.length > 0 && this.tasks.every(t => t.status === "DONE")) {
      this.status = ProcessStatus.DONE;
      this.completedAt = new Date();
      this.addHistory(ProcessStatus.DONE, "SYSTEM", "All tasks completed");
    } else if (this.tasks.some(t => t.status === "IN_PROGRESS")) {
      this.status = ProcessStatus.IN_PROGRESS;
    } else {
      this.status = ProcessStatus.OPEN;
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
