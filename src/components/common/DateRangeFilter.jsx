import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Icon } from "@/components/ui";
import { cn } from "@/utils/cn";

const VALUE_FORMAT = "YYYY-MM-DD";
const LABEL_FORMAT = "DD MMM YYYY";
const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const today = () => dayjs().startOf("day");

const PRESETS = [
  { key: "today", label: "Today", range: () => [today(), today()] },
  { key: "yesterday", label: "Yesterday", range: () => [today().subtract(1, "day"), today().subtract(1, "day")] },
  { key: "7d", label: "Last 7 days", range: () => [today().subtract(6, "day"), today()] },
  { key: "30d", label: "Last 30 days", range: () => [today().subtract(29, "day"), today()] },
  { key: "month", label: "This month", range: () => [today().startOf("month"), today()] },
  {
    key: "last-month",
    label: "Last month",
    range: () => {
      const month = today().subtract(1, "month");
      return [month.startOf("month"), month.endOf("month").startOf("day")];
    },
  },
  { key: "90d", label: "Last 90 days", range: () => [today().subtract(89, "day"), today()] },
];

const sameDay = (a, b) => Boolean(a && b && a.isSame(b, "day"));

/** Key of the preset that produces exactly this range, "custom" for any other complete range, "" for none. */
const presetKeyFor = (start, end) => {
  if (!start || !end) return "";
  const match = PRESETS.find((preset) => {
    const [from, to] = preset.range();
    return sameDay(from, start) && sameDay(to, end);
  });
  return match ? match.key : "custom";
};

const parse = (value) => (value ? dayjs(value, VALUE_FORMAT) : null);

/** The 6x7 grid of days (weeks start on Sunday) shown for `month`. */
const buildDays = (month) => {
  const first = month.startOf("month");
  const gridStart = first.subtract(first.day(), "day");
  return Array.from({ length: 42 }, (_, index) => gridStart.add(index, "day"));
};

/**
 * Date-range dropdown: quick presets on the left, a range calendar on the right and a
 * Clear / Apply footer. Dates are reported as `YYYY-MM-DD` strings, "" when cleared.
 * The latest selectable day is today.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {(range: {startDate: string, endDate: string}) => void} onChange
 * @param {string} [className]  Extra classes for the wrapper (width / spacing).
 */
export default function DateRangeFilter({ startDate, endDate, onChange, className }) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(true);
  const [draft, setDraft] = useState({ start: null, end: null });
  const [month, setMonth] = useState(() => today().startOf("month"));
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const appliedStart = parse(startDate);
  const appliedEnd = parse(endDate);
  const appliedKey = presetKeyFor(appliedStart, appliedEnd);
  const appliedPreset = PRESETS.find((preset) => preset.key === appliedKey);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    // Open to the left when there is not enough room on the left of the trigger for the panel.
    const rect = rootRef.current?.getBoundingClientRect();
    setAlignRight(!rect || rect.right >= 560);
    setDraft({ start: appliedStart, end: appliedEnd });
    setMonth((appliedEnd ?? today()).startOf("month"));
    setHover(null);
    setOpen(true);
  };

  const pickPreset = (preset) => {
    const [start, end] = preset.range();
    setDraft({ start, end });
    setMonth(end.startOf("month"));
  };

  const pickDay = (day) => {
    setDraft((prev) => {
      if (!prev.start || prev.end) return { start: day, end: null };
      return day.isBefore(prev.start, "day") ? { start: day, end: prev.start } : { start: prev.start, end: day };
    });
  };

  const apply = () => {
    if (!draft.start) return;
    const end = draft.end ?? draft.start;
    onChange({ startDate: draft.start.format(VALUE_FORMAT), endDate: end.format(VALUE_FORMAT) });
    setOpen(false);
  };

  const clear = () => {
    onChange({ startDate: "", endDate: "" });
    setDraft({ start: null, end: null });
    setOpen(false);
  };

  // While the end date is still being picked, preview the range up to the hovered day.
  const previewEnd = draft.start && !draft.end && hover ? hover : draft.end;
  const rangeFrom = draft.start && previewEnd && previewEnd.isBefore(draft.start, "day") ? previewEnd : draft.start;
  const rangeTo = draft.start && previewEnd && previewEnd.isBefore(draft.start, "day") ? draft.start : previewEnd;
  const draftKey = presetKeyFor(draft.start, draft.end);

  const maxMonth = today().startOf("month");
  const canGoNext = month.isBefore(maxMonth, "month");

  let triggerLabel = <span className="text-muted">Select Date</span>;
  if (appliedStart && appliedEnd) {
    triggerLabel = appliedPreset
      ? appliedPreset.label
      : `${appliedStart.format(LABEL_FORMAT)} - ${appliedEnd.format(LABEL_FORMAT)}`;
  }

  let selectedText = "No dates selected";
  if (draft.start && draft.end) {
    selectedText = `Selected: ${draft.start.format(LABEL_FORMAT)} - ${draft.end.format(LABEL_FORMAT)}`;
  } else if (draft.start) {
    selectedText = `Selected: ${draft.start.format(LABEL_FORMAT)} - pick an end date`;
  }

  return (
    <div ref={rootRef} className={cn("relative w-full sm:w-auto", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border bg-surface px-3 text-left text-[14px] text-ink shadow-xs transition duration-150 hover:bg-surface-2 sm:w-52",
          open ? "border-primary ring-4 ring-primary/15" : "border-line",
        )}
      >
        <Icon name="calendar" size={16} className={cn("shrink-0", open ? "text-primary" : "text-muted")} />
        <span className="min-w-0 flex-1 truncate">{triggerLabel}</span>
      </button>

      {open && (
        <>
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 sm:hidden"></div>
          <div
            role="dialog"
            aria-label="Select date range"
            className={cn(
              "z-50 flex flex-col overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-dropdown",
              "max-sm:fixed max-sm:inset-x-4 max-sm:top-20 max-sm:max-h-[85vh] max-sm:overflow-y-auto",
              "sm:absolute sm:top-full sm:mt-2 sm:w-130",
              alignRight ? "sm:right-0" : "sm:left-0",
            )}
          >
            <div className="flex flex-col sm:flex-row">
              <ul className="m-0 flex list-none flex-wrap gap-1 border-b border-line p-3 sm:w-45 sm:shrink-0 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0">
                {PRESETS.map((preset) => (
                  <li key={preset.key} className="max-sm:flex-1 max-sm:basis-[calc(50%-0.25rem)]">
                    <PresetButton active={draftKey === preset.key} onClick={() => pickPreset(preset)}>
                      {preset.label}
                    </PresetButton>
                  </li>
                ))}
                <li className="max-sm:flex-1 max-sm:basis-[calc(50%-0.25rem)]">
                  <PresetButton
                    active={!PRESETS.some((preset) => preset.key === draftKey)}
                    onClick={() => setDraft({ start: null, end: null })}
                  >
                    Custom range
                  </PresetButton>
                </li>
              </ul>

              <div className="min-w-0 flex-1 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <NavButton label="Previous month" onClick={() => setMonth((m) => m.subtract(1, "month"))}>
                    <Icon name="chevron-left" size={16} />
                  </NavButton>
                  <p className="m-0 text-[14px] font-semibold">{month.format("MMMM YYYY")}</p>
                  <NavButton label="Next month" disabled={!canGoNext} onClick={() => setMonth((m) => m.add(1, "month"))}>
                    <Icon name="chevron-right" size={16} />
                  </NavButton>
                </div>

                <div className="grid grid-cols-7 text-center">
                  {WEEKDAYS.map((weekday) => (
                    <span key={weekday} className="py-2 text-[11px] font-semibold tracking-wider text-muted">
                      {weekday}
                    </span>
                  ))}
                  {buildDays(month).map((day) => {
                    const disabled = day.isAfter(today(), "day");
                    const isStart = sameDay(day, rangeFrom);
                    const isEnd = sameDay(day, rangeTo);
                    const inRange = Boolean(rangeFrom && rangeTo) && !day.isBefore(rangeFrom, "day") && !day.isAfter(rangeTo, "day");
                    const edge = isStart || isEnd;
                    const outside = !day.isSame(month, "month");
                    return (
                      <div
                        key={day.valueOf()}
                        className={cn(
                          "flex h-9 items-center justify-center",
                          inRange && "bg-primary/10",
                          isStart && "rounded-l-full",
                          isEnd && "rounded-r-full",
                        )}
                      >
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => pickDay(day)}
                          onMouseEnter={() => setHover(day)}
                          onMouseLeave={() => setHover(null)}
                          aria-label={day.format("D MMMM YYYY")}
                          aria-pressed={edge}
                          className={cn(
                            "size-9 cursor-pointer rounded-full border-0 bg-transparent text-[13px] tabular-nums transition-colors",
                            outside ? "text-muted/60" : "text-ink",
                            !edge && !disabled && "hover:bg-primary/15",
                            inRange && !edge && "text-primary",
                            edge && "bg-primary-solid font-semibold text-white",
                            disabled && "cursor-not-allowed text-muted/40",
                          )}
                        >
                          {day.date()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
              <p className="m-0 min-w-0 text-[12px] text-muted">{selectedText}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clear}
                  className="h-9 cursor-pointer rounded-lg border-0 bg-transparent px-3 text-[14px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={apply}
                  disabled={!draft.start}
                  className="h-9 cursor-pointer rounded-lg border-0 bg-primary-solid px-4 text-[14px] font-semibold text-white transition-colors hover:bg-primary-solid-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PresetButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 w-full cursor-pointer rounded-lg border-0 px-3 text-left text-[14px] transition-colors",
        active ? "bg-primary/10 font-semibold text-primary" : "bg-transparent text-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function NavButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
