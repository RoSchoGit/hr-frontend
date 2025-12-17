// src/utils/date.ts
export const pad = (n: number) => String(n).padStart(2, "0");

export const parseLocalInputToDate = (raw?: string): Date | undefined => {
  if (!raw) return undefined;
  // raw can be "YYYY-MM-DD", "HH:mm:ss" or "YYYY-MM-DDTHH:mm:ss"
  try {
    if (raw.length === 10 && raw[4] === "-") {
      // date only
      const [y, m, d] = raw.split("-").map(Number);
      return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    if ((raw.length === 8 || raw.length === 5) && raw.includes(":")) {
      // time only -> attach to today
      const parts = raw.substring(0, 8).split(":").map(Number);
      const now = new Date();
      now.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
      return now;
    }
    // datetime-local "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
    const [datePart, timePart] = raw.split("T");
    if (!timePart) return undefined;
    const [y, m, d] = datePart.split("-").map(Number);
    const t = timePart.substring(0, 8).split(":").map(Number);
    return new Date(y, m - 1, d, t[0] || 0, t[1] || 0, t[2] || 0, 0);
  } catch {
    return undefined;
  }
};

// optional: formatter returning normalized string (YYYY-MM-DDTHH:mm:ss)
export const formatDateToNormalized = (d: Date | undefined | null): string | undefined => {
  if (!d) return undefined;
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
