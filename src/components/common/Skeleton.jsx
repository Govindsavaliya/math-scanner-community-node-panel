import { cn } from "@/utils/cn";

/** Shimmering placeholder block. */
export function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-2 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/40 before:to-transparent dark:before:via-white/5",
        className,
      )}
    />
  );
}

/** Placeholder table rows shown during the first load of a table. */
export function SkeletonRows({ rows = 6, cols = 4 }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={row} aria-hidden="true">
      {Array.from({ length: cols }, (_, col) => (
        <td key={col}>
          <Skeleton className={cn("h-4", col === 0 ? "w-6" : col % 2 ? "w-3/4" : "w-1/2")} />
        </td>
      ))}
    </tr>
  ));
}
