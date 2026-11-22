import EmptyState from "./EmptyState";

/** Slim indeterminate bar along the top of a card while a table (re)loads; content stays visible. */
export function TableLoader({ loading }) {
  if (!loading) return null;
  return (
    <div
      role="status"
      aria-label="Loading"
      className="pointer-events-none absolute inset-x-0 top-0 z-5 h-0.5 overflow-hidden rounded-t-xl bg-primary/15"
    >
      <div className="h-full w-1/3 animate-[indeterminate_1.1s_ease-in-out_infinite] rounded-full bg-primary"></div>
    </div>
  );
}

/** Full-width empty row for use inside a <tbody>; props are passed to EmptyState. */
export function EmptyRow(props) {
  return (
    <tr>
      {/* td& outranks the Table cell padding */}
      <td colSpan={100} className="[td&]:p-0">
        <EmptyState {...props} />
      </td>
    </tr>
  );
}
