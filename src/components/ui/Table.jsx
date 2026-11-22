import { cn } from "@/utils/cn";

// Cell rules use :where() so utilities passed to a <td>/<th> (padding, borders) still win.
const LAYOUT = {
  // Bordered table inside a rounded, ringed scroll container.
  responsive:
    "mb-0 [&_:where(th,td)]:border-b [&_:where(th,td)]:border-line [&_:where(th,td)]:px-4 [&_:where(th,td)]:py-3.5 [&_tr:last-child_:where(td)]:border-b-0 [&_:where(thead_th)]:text-[12px] [&_:where(thead_th)]:font-semibold [&_:where(thead_th)]:tracking-wider [&_:where(thead_th)]:text-muted [&_:where(thead_th)]:uppercase [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-canvas/70",
  bordered: "mb-4 [&_:where(th,td)]:border [&_:where(th,td)]:border-line [&_:where(th,td)]:p-2",
  plain: "mb-4 [&_:where(th,td)]:border-b [&_:where(th,td)]:border-line [&_:where(th,td)]:p-2",
};

/** @param {boolean} [responsive] Wraps the table in a scroll container (and gives it the bordered look). */
export default function Table({ bordered, striped, hover, responsive, className, ...props }) {
  const table = (
    <table
      className={cn(
        "w-full text-[14.5px] text-ink [&_:where(thead_th)]:bg-canvas/70",
        responsive ? LAYOUT.responsive : bordered ? LAYOUT.bordered : LAYOUT.plain,
        striped && "[&_tbody_tr:nth-of-type(odd)]:bg-black/5",
        hover && "[&_tbody_tr:hover]:bg-black/7.5",
        className,
      )}
      {...props}
    />
  );
  return responsive ? (
    <div data-table className="overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
      {table}
    </div>
  ) : (
    table
  );
}
