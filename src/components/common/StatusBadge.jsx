import { cn } from "@/utils/cn";

const TONES = {
  success: "bg-success/10 text-success",
  neutral: "bg-surface-2 text-muted",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

/** Small tinted label. A dot is always shown so status is not conveyed by colour alone. */
export default function StatusBadge({ tone = "neutral", dot = true, children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] leading-5 font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true"></span>}
      {children}
    </span>
  );
}
