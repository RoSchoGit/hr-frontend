import { Industry } from "../Process";
import { TaskType } from "@/task/Task";


export interface MetadataField {
    key: string;
    label: string;
    type: "text" | "number" | "date" | "checkbox" | "select";
    options?: string[];
    required?: boolean;
    value?: any;
    placeholder?: string;
    description?: string;
}

  export const metadataTemplates: Record<Industry, Record<TaskType, MetadataField[]>> = {
    [Industry.GENERAL_SERVICES]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "formNumber", label: "Formularnummer", type: "text", required: true },
        { key: "priority", label: "Priorität", type: "select", options: ["Hoch", "Mittel", "Niedrig"] },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "docType", label: "Dokumenttyp", type: "select", options: ["Checkliste", "Bericht"] },
      ],
      [TaskType.TRAINING]: [
        { key: "trainer", label: "Trainer", type: "text" },
        { key: "duration", label: "Dauer (Std.)", type: "number" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "equipment", label: "Ausrüstung", type: "text" },
        { key: "serialNumber", label: "Seriennummer", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "location", label: "Ort", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.HANDWERK]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "projectNumber", label: "Projekt-Nr.", type: "text" },
        { key: "budget", label: "Budget (€)", type: "number" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "blueprint", label: "Bauplan vorhanden?", type: "checkbox" },
        { key: "inspectionReport", label: "Prüfbericht", type: "text" },
      ],
      [TaskType.TRAINING]: [
        { key: "trainer", label: "Trainer", type: "text" },
        { key: "toolCertification", label: "Werkzeug-Zertifikat", type: "checkbox" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "tools", label: "Werkzeuge", type: "text" },
        { key: "safetyGear", label: "Schutzausrüstung", type: "checkbox" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "site", label: "Baustelle / Ort", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.RETAIL]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "cashRegisterAudit", label: "Kassenprüfung", type: "checkbox" },
        { key: "shiftPlan", label: "Dienstplan", type: "text" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "stockCount", label: "Inventur", type: "number" },
        { key: "report", label: "Bericht", type: "text" },
      ],
      [TaskType.TRAINING]: [
        { key: "trainer", label: "Trainer", type: "text" },
        { key: "productKnowledge", label: "Produktwissen", type: "checkbox" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "POSDevice", label: "POS Gerät", type: "text" },
        { key: "keys", label: "Schlüssel", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "location", label: "Ort", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.GASTRONOMY]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "menuUpdate", label: "Menüaktualisierung", type: "text" },
        { key: "staffSchedule", label: "Personalplan", type: "text" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "hygieneReport", label: "Hygienebericht", type: "text" },
        { key: "inventory", label: "Inventur", type: "number" },
      ],
      [TaskType.TRAINING]: [
        { key: "chefTrainer", label: "Küchentrainer", type: "text" },
        { key: "hours", label: "Stunden", type: "number" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "kitchenTools", label: "Küchenwerkzeuge", type: "text" },
        { key: "appliances", label: "Geräte", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "room", label: "Raum", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.HEALTHCARE]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "patientFile", label: "Patientenakte", type: "text" },
        { key: "insuranceCheck", label: "Versicherung geprüft?", type: "checkbox" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "medicalReport", label: "Bericht", type: "text" },
        { key: "prescriptions", label: "Rezepte", type: "text" },
      ],
      [TaskType.TRAINING]: [
        { key: "trainer", label: "Trainer", type: "text" },
        { key: "certification", label: "Zertifizierung", type: "text" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "medicalEquipment", label: "Medizinische Geräte", type: "text" },
        { key: "manual", label: "Bedienungsanleitung", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "room", label: "Raum", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.LEGAL]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "caseNumber", label: "Aktenzeichen", type: "text" },
        { key: "deadline", label: "Frist", type: "date" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "contract", label: "Vertrag", type: "text" },
        { key: "minutes", label: "Protokoll", type: "text" },
      ],
      [TaskType.TRAINING]: [
        { key: "lawTrainer", label: "Trainer", type: "text" },
        { key: "hours", label: "Stunden", type: "number" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "legalDocs", label: "Unterlagen", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "conferenceRoom", label: "Raum", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.CONSULTING]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "client", label: "Kunde", type: "text" },
        { key: "budget", label: "Budget (€)", type: "number" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "report", label: "Bericht", type: "text" },
        { key: "slides", label: "Präsentation", type: "text" },
      ],
      [TaskType.TRAINING]: [
        { key: "trainer", label: "Trainer", type: "text" },
        { key: "hours", label: "Stunden", type: "number" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "equipment", label: "Ausrüstung", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "location", label: "Ort", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },
  
    [Industry.EDUCATION]: {
      [TaskType.NOT_SPECIFIC]: [],
      [TaskType.ADMINISTRATION]: [
        { key: "courseName", label: "Kursname", type: "text" },
        { key: "participants", label: "Teilnehmerzahl", type: "number" },
      ],
      [TaskType.DOCUMENTATION]: [
        { key: "lessonPlan", label: "Stundenplan", type: "text" },
        { key: "examResults", label: "Ergebnisse", type: "text" },
      ],
      [TaskType.TRAINING]: [
        { key: "trainer", label: "Trainer", type: "text" },
        { key: "hours", label: "Stunden", type: "number" },
      ],
      [TaskType.EQUIPMENT_HANDOVER]: [
        { key: "teachingMaterials", label: "Materialien", type: "text" },
      ],
      [TaskType.MEETING]: [
        { key: "meetingDate", label: "Datum", type: "date" },
        { key: "room", label: "Raum", type: "text" },
      ],
      [TaskType.OTHER]: [
        { key: "notes", label: "Notizen", type: "text" },
      ],
    },

    [Industry.CONSTRUCTION]: {
        [TaskType.NOT_SPECIFIC]: [],
        [TaskType.ADMINISTRATION]: [],
        [TaskType.DOCUMENTATION]: [],
        [TaskType.TRAINING]: [],
        [TaskType.EQUIPMENT_HANDOVER]: [],
        [TaskType.MEETING]: [],
        [TaskType.OTHER]: [],
      },
      
      [Industry.TRANSPORT_LOGISTICS]: {
        [TaskType.NOT_SPECIFIC]: [],
        [TaskType.ADMINISTRATION]: [],
        [TaskType.DOCUMENTATION]: [],
        [TaskType.TRAINING]: [],
        [TaskType.EQUIPMENT_HANDOVER]: [],
        [TaskType.MEETING]: [],
        [TaskType.OTHER]: [],
      },
      
      [Industry.IT_SERVICES]: {
        [TaskType.NOT_SPECIFIC]: [],
        [TaskType.ADMINISTRATION]: [],
        [TaskType.DOCUMENTATION]: [],
        [TaskType.TRAINING]: [],
        [TaskType.EQUIPMENT_HANDOVER]: [],
        [TaskType.MEETING]: [],
        [TaskType.OTHER]: [],
      },
      
  };
  