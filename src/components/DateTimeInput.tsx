type Mode = "date" | "datetime-local" | "time";

interface Props {
    label?: string;
    mode?: Mode;
    value?: string | Date | null;
    onChange: (value?: string) => void;
    name?: string;
    min?: string;
    max?: string;
    className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatLocalTime = (d: Date) =>
    `${pad(d.getHours())}:${pad(d.getMinutes())}`;

const formatLocalDateTime = (d: Date) =>
    `${formatLocalDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

/**
 * Convert incoming value (string possibly with timezone, or Date) to the input value expected by the control.
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
    // Normalize to input expected length:
    if (mode === "date") {
        return value.substring(0, 10);
    }
    if (mode === "time") {
        // value like "HH:mm" or "HH:mm:ss" -> input expects "HH:mm"
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
        // raw "HH:mm" -> produce "HH:mm:00"
        return raw.length === 5 ? `${raw}:00` : raw.substring(0, 8);
    }
    // datetime-local: raw "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
    if (raw.length === 16) return `${raw}:00`;
    return raw.substring(0, 19); // keep up to seconds
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
}: Props) {
    const inputValue = toInputValue(value, mode);

    return (
        <div className={className}>
            {label && <label className="block font-semibold mb-1">{label}</label>}
            <input
                name={name}
                type={mode}
                value={inputValue}
                min={min}
                max={max}
                onChange={(e) => onChange(normalizeOutput(e.target.value, mode))}
                className="border rounded p-2"
            />
        </div>
    );
}
