import { useState } from "react";
import { cn } from "@/utils/cn";

const COLORS = ["bg-indigo-600", "bg-sky-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-violet-600"];

const initialsOf = (name) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/** Round avatar: shows the image, or initials on a colored circle when it is missing or fails to load. */
export default function Avatar({ src, name, className }) {
  const [failed, setFailed] = useState(false);
  const base = "inline-flex size-10 shrink-0 items-center justify-center rounded-full align-middle";

  if (src && !failed) {
    return <img src={src} alt={name ? `${name} profile picture` : "User profile picture"} onError={() => setFailed(true)} className={cn(base, "object-cover", className)} />;
  }
  const color = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  return (
    <span aria-hidden="true" className={cn(base, color, "text-[13px] font-semibold text-white", className)}>
      {initialsOf(name)}
    </span>
  );
}
