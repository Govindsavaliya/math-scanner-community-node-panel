/**
 * Centered spinner. Default: overlay covering its positioned parent (tables).
 * `page`: in-flow block filling the viewport area (route chunk fallback).
 */
export default function PageLoader({ label = "Loading...", page = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        page
          ? "flex min-h-[calc(100vh-190px)] flex-col items-center justify-center gap-3"
          : "absolute inset-0 z-5 flex min-h-55 flex-col items-center justify-center gap-3 rounded-[inherit] bg-surface/80 backdrop-blur-[2px]"
      }
    >
      <span
        className="size-10 animate-spin rounded-full border-3 border-primary/20 border-t-primary"
        aria-hidden="true"
      ></span>
      <span className="text-[13px] font-medium text-muted">{label}</span>
    </div>
  );
}
