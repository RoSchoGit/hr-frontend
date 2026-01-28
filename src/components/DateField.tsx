import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./DateField.css";

export function DateField({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (d?: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="date-field">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="date-field__button"
      >
        <span className="date-field__value">
          {value ? format(value, "dd.MM.yyyy") : "Datum wählen"}
        </span>
        <CalendarIcon className="date-field__icon" />
      </button>

      {open && (
        <div className="date-field__popup">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
