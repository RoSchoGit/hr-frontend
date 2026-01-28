export enum ProcessStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED"
}

export enum ProcessType {
  NOT_SPECIFIC = "NOT_SPECIFIC",
  ONBOARDING = "ONBOARDING",
  LEAVE_REQUEST = "LEAVE_REQUEST",
  HIRE = "HIRE",
  TERMINATION = "TERMINATION",
  TRAINING = "TRAINING",
  PERFORMANCE_REVIEW = "PERFORMANCE_REVIEW"
}

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

export interface Metadata {
  [key: string]: string | number | boolean | string[] | number[] | null;
}

export interface ProcessHistoryEntry {
  date: string;
  status: ProcessStatus;
  changedBy: string;
  comment?: string;
}

export interface Process {
  id: string;
  type: ProcessType;
  title: string;
  description?: string;
  industries: Industry[];
  status: ProcessStatus;
  creator: string;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
 // history?: ProcessHistoryEntry[];
  metadata?: Metadata;
}

export class ProcessImpl implements Process {
  id: string;
  type: ProcessType;
  title: string;
  description?: string;
  industries: Industry[];
  status: ProcessStatus;
  creator: string;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
//  history: ProcessHistoryEntry[];
  metadata?: Metadata;

  constructor(
    id: string,
    type: ProcessType,
    title: string,
    creator: string,
    industries: Industry[] = [Industry.GENERAL_SERVICES],
    description?: string,
    metadata?: Metadata,
    dueDate?: string
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.description = description;
    this.creator = creator;
    this.industries = industries;
    this.status = ProcessStatus.OPEN;
    this.createdAt = new Date().toISOString().substring(0,19); // "2025-11-23T14:30:00"
       // this.history = [];
    this.metadata = metadata;
    this.dueDate = dueDate;
//    this.addHistory(ProcessStatus.OPEN, creator, "Process created");
  }

  setStatus(newStatus: ProcessStatus) {
    this.status = newStatus;
    if (newStatus === ProcessStatus.DONE) {
      this.completedAt = new Date().toISOString().substring(0,19);
    }
//    this.addHistory(newStatus, changedBy, comment);
  }

//  private addHistory(status: ProcessStatus, changedBy: string, comment?: string) {
//    this.history.push({
//      date: new string(),
//      status,
//      changedBy,
//      comment
//    });
//  }
}
