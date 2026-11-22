import { cn } from "@/utils/cn";

/**
 * Standard page heading: title (+ count pill) and description on the left, actions on the right.
 * Breadcrumbs live in the top bar (derived from the route).
 *
 * @param {React.ReactNode} title
 * @param {React.ReactNode} [description] Short muted line under the title.
 * @param {React.ReactNode} [count]       Rendered as a pill next to the title.
 * @param {React.ReactNode} [actions]     Right-aligned content (buttons, filters).
 */
export default function PageHeader({ title, titleClassName, description, count, actions, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className={cn("m-0 flex items-center gap-2 text-[24px] leading-[1.25] font-[650] tracking-tight text-ink", titleClassName)}>
          {title}
          {count !== undefined && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[12px] font-semibold text-primary tabular-nums">{count}</span>
          )}
        </h1>
        {description && <p className="mt-1 mb-0 text-[14px] text-muted">{description}</p>}
      </div>
      {actions}
      {children}
    </div>
  );
}
