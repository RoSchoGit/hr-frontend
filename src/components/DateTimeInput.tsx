// DateTimeInput.tsx
import React from "react";

// Optional: wenn du react-datepicker verwenden willst, installiere es und importiere die CSS in deiner App
// npm install react-datepicker
// import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

type Mode = "date" | "datetime-local" | "time";

interface Props {
    label?: string;
    mode?: Mode;
    value?: string | Date | null;
    onChange: (value?: string) => void; // normalized string as before
    name?: string;
    min?: string;
    max?: string;
    className?: string;
    picker?: "native" | "react"; // new: choose native input or react-datepicker
    timeIntervals?: number; // minutes interval for react-datepicker
    showClear?: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatLocalTime = (d: Date) =>
    `${pad(d.getHours())}:${pad(d.getMinutes())}`;

const formatLocalDateTime = (d: Date) =>
    `${formatLocalDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

/**
 * Format Date -> normalized output strings:
 * - date => "YYYY-MM-DD"
 * - time => "HH:mm:ss"
 * - datetime-local => "YYYY-MM-DDTHH:mm:ss"
 */
const formatDateToNormalized = (d: Date, mode: Mode): string => {
    if (mode === "date") return formatLocalDate(d);
    if (mode === "time") {
        return `${formatLocalTime(d)}:${pad(d.getSeconds())}`;
    }
    // datetime-local
    const datePart = formatLocalDate(d);
    const timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return `${datePart}T${timePart}`;
};

/**
 * Convert incoming value (string possibly with timezone, or Date) to the input value expected by the control.
 * (Same semantics as before: returns e.g. "YYYY-MM-DD", "HH:mm", "YYYY-MM-DDTHH:mm")
 */
const toInputValue = (value: string | Date | null | undefined, mode: Mode): string => {
    if (!value) return "";

    if (value instanceof Date) {
        if (mode === "date") return formatLocalDate(value);
        if (mode === "time") return `${formatLocalTime(value)}`;
        return formatLocalDateTime(value);
    }

    // value is string
    // If string contains timezone info (Z or +HH:MM), convert to local Date then format
    if (/[zZ]|[+\-]\d{2}(:\d{2})?$/.test(value)) {
        const d = new Date(value);
        if (isNaN(d.getTime())) return "";
        return toInputValue(d, mode);
    }

    // string without timezone: assume it's already LocalDate / LocalDateTime / time
    if (mode === "date") {
        return value.substring(0, 10);
    }
    if (mode === "time") {
        return value.substring(0, 5);
    }
    // datetime-local -> input expects "YYYY-MM-DDTHH:mm"
    return value.substring(0, 16);
};

/**
 * Normalize value coming from input to a backend-friendly string:
 * - date => "YYYY-MM-DD"
 * - time => "HH:mm:ss"
 * - datetime-local => "YYYY-MM-DDTHH:mm:ss"
 */
const normalizeOutput = (raw: string, mode: Mode): string | undefined => {
    if (!raw) return undefined;
    if (mode === "date") return raw.substring(0, 10);
    if (mode === "time") {
        return raw.length === 5 ? `${raw}:00` : raw.substring(0, 8);
    }
    // datetime-local: raw "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
    if (raw.length === 16) return `${raw}:00`;
    return raw.substring(0, 19);
};

/**
 * Parse local input-string (from native input or from react-datepicker selected Date) to a Date object in local timezone.
 */
const parseLocalStringToDate = (raw: string, mode: Mode): Date | undefined => {
    if (!raw) return undefined;
    try {
        if (mode === "date") {
            // "YYYY-MM-DD" -> local midnight
            const [y, m, d] = raw.substring(0, 10).split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
        }
        if (mode === "time") {
            // "HH:mm" or "HH:mm:ss" -> today at that time
            const parts = raw.substring(0, 8).split(":").map(Number);
            const now = new Date();
            now.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
            return now;
        }
        // datetime-local "YYYY-MM-DDTHH:mm" (or with seconds)
        const [datePart, timePart] = raw.split("T");
        if (!timePart) return undefined;
        const [y, m, d] = datePart.split("-").map(Number);
        const t = timePart.substring(0, 8).split(":").map(Number);
        return new Date(y, (m || 1) - 1, d || 1, t[0] || 0, t[1] || 0, t[2] || 0, 0);
    } catch {
        return undefined;
    }
};

/**
 * Parse a Date (possibly from react-datepicker) to the input-string representation expected by native input ("YYYY-MM-DD", "HH:mm", "YYYY-MM-DDTHH:mm")
 */
const dateToInputString = (d: Date | null, mode: Mode): string => {
    if (!d) return "";
    if (mode === "date") return formatLocalDate(d);
    if (mode === "time") return formatLocalTime(d);
    return formatLocalDateTime(d);
};

export default function DateTimeInput({
    label,
    mode = "date",
    value,
    onChange,
    name,
    min,
    max,
    className,
    picker = "native",
    timeIntervals = 15,
    showClear = true,
}: Props) {
    const inputValue = toInputValue(value, mode);

    // If using react-datepicker we need a Date object for `selected`
    const valueAsDate = React.useMemo(() => {
        if (!value) return null;
        if (value instanceof Date) return value;
        // value is string: try to parse as normalized (including timezone handled earlier in toInputValue)
        // Prefer parseLocalStringToDate so we create local Date objects
        const parsed = parseLocalStringToDate(value, mode);
        return parsed ?? null;
    }, [value, mode]);

    // Handler used by both native and react picker: always call onChange with normalized string (or undefined)
    const emitNormalized = (raw: string) => {
        const normalized = normalizeOutput(raw, mode);
        onChange(normalized);
    };

    // react-datepicker change handler -> receives Date | null
    const handleReactChange = (d: Date | null) => {
        if (!d) {
            onChange(undefined);
        } else {
            // convert Date -> normalized string (YYYY-MM-DDTHH:mm:ss or others)
            const normalized = formatDateToNormalized(d, mode);
            onChange(normalized);
        }
    };

    // Native input onChange
    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        emitNormalized(e.target.value);
    };

    return (
        <div className={className}>
            {label && <label className="block font-semibold mb-1">{label}</label>}

            {picker === "react" ? (
                <DatePicker
                    selected={valueAsDate}
                    onChange={handleReactChange}
                    showTimeSelect={mode === "datetime-local"}
                    showTimeSelectOnly={mode === "time"}
                    timeIntervals={timeIntervals}
                    timeFormat={mode === "time" ? "HH:mm" : "HH:mm"}
                    dateFormat={mode === "date" ? "yyyy-MM-dd" : mode === "time" ? "HH:mm" : "yyyy-MM-dd HH:mm"}
                    placeholderText={mode === "date" ? "Datum wählen" : mode === "time" ? "Uhrzeit wählen" : "Datum & Zeit wählen"}
                    isClearable={showClear}
                    className="border rounded p-2"
                // If you want to restrict min/max you can map min/max props to react-datepicker props (not implemented here)
                />
            ) : (
                <input
                    name={name}
                    type={mode}
                    value={inputValue}
                    min={min}
                    max={max}
                    onChange={handleNativeChange}
                    className="border rounded p-2 w-full"
                />
            )}
        </div>
    );
}
