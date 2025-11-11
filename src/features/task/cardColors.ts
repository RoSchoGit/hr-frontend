// src/utils/cardColors.ts
import { DueDateUtils } from "@/utils/DueDateUtils";
import { StatusUtils } from "@/utils/StatusUtils";

export type HasDueAndStatus = {
  dueDate?: string | Date | null;
  status: string;
};

export type CardColors = {
  borderColor?: string;
  dueColor?: string;
  statusColor?: string;
  dueTextColor?: string;
  statusTextColor?: string;
};

/** Liefert die Farben für Task / Process etc. */
export function getCardColors(entity?: HasDueAndStatus): CardColors {
  if (!entity) return {};
  const due = DueDateUtils.dueColors(entity.dueDate);
  const status = StatusUtils.getStatusColor(entity.status);

  return {
    borderColor: status?.border,
    dueColor: due?.bg,
    statusColor: status?.bg,
    dueTextColor: due?.text,
    statusTextColor: status?.text,
  };
}
