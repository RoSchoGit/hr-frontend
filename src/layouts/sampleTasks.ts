import type { Task } from "@/models/Task";
import { TaskStatus } from "@/models/Task";
import { ProcessType } from "@/models/Process";

// Beispiel-Tasks
export const sampleTasks: Task[] = [
  {
    id: "t1",
    title: "Mitarbeiter einarbeiten",
    description: "Neuer Mitarbeiter soll ins System eingepflegt werden",
    creator: "Max",
    assignee: "Lisa",
    status: TaskStatus.OPEN,
    dueDate: new Date(),
    attachments: [],
    createdAt: new Date(),
    completedAt: new Date(),
    type: ProcessType.ONBOARDING,
    complete() {
      this.status = TaskStatus.DONE;
      this.completedAt = new Date();
    },
  },
  {
    id: "t2",
    title: "Auftrag erstellen",
    description: "Neuer Mitarbeiter soll ins System eingepflegt werden",
    creator: "Max",
    assignee: "Lisa",
    status: TaskStatus.OPEN,
    dueDate: new Date(),
    attachments: [],
    createdAt: new Date(),
    completedAt: new Date(),
    type: ProcessType.ONBOARDING,
    complete() {
      this.status = TaskStatus.DONE;
      this.completedAt = new Date();
    },
  },
  {
    id: "t3",
    title: "Termin machen",
    description: "Neuer Mitarbeiter soll ins System eingepflegt werden",
    creator: "Max",
    assignee: "Lisa",
    status: TaskStatus.OPEN,
    dueDate: new Date(),
    attachments: [],
    createdAt: new Date(),
    completedAt: new Date(),
    type: ProcessType.ONBOARDING,
    complete() {
      this.status = TaskStatus.DONE;
      this.completedAt = new Date();
    },
  },
  {
    id: "t4",
    title: "Kunde anrufen",
    description: "Neuer Mitarbeiter soll ins System eingepflegt werden",
    creator: "Max",
    assignee: "Lisa",
    status: TaskStatus.OPEN,
    dueDate: new Date(),
    attachments: [],
    createdAt: new Date(),
    completedAt: new Date(),
    type: ProcessType.ONBOARDING,
    complete() {
      this.status = TaskStatus.DONE;
      this.completedAt = new Date();
    },
  },
  {
    id: "t5",
    title: "Krankschreiben a",
    description: "Neuer Mitarbeiter soll ins System eingepflegt werden",
    creator: "Max",
    assignee: "Lisa",
    status: TaskStatus.OPEN,
    dueDate: new Date(),
    attachments: [],
    createdAt: new Date(),
    completedAt: new Date(),
    type: ProcessType.ONBOARDING,
    complete() {
      this.status = TaskStatus.DONE;
      this.completedAt = new Date();
    },
  },
 
];
