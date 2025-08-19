// utils/StatusUtils.ts
export type StatusColors = {
    bg: string;
    text: string;
    border: string;
  };
  
  export class StatusUtils {
    static getStatusColor(status: string): StatusColors {
      switch (status) {
        case "DONE":
          return { bg: "#d1fae5", text: "#065f46", border: "#10b981" }; // grün
        case "IN_PROGRESS":
          return { bg: "#fef3c7", text: "#78350f", border: "#facc15" }; // gelb
        case "OPEN":
          return { bg: "#bfdbfe", text: "#1e3a8a", border: "#3b82f6" }; // blau
        case "ARCHIVED":
          return { bg: "#f3f4f6", text: "#374151", border: "#9ca3af" }; // grau (nur Process)
        default:
          return { bg: "#e5e7eb", text: "#1f2937", border: "#d1d5db" }; // default grau
      }
    }
  }
  