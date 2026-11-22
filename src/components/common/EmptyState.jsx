import { Link } from "react-router-dom";
import { Button, Icon } from "@/components/ui";

/** Contextual empty state; pass `actionTo` + `actionLabel` for a call to action. */
export default function EmptyState({
  title = "Nothing here yet",
  hint = "There is no data to show right now.",
  icon = "folder",
  actionTo,
  actionLabel,
}) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-[32px] text-primary">
        <Icon name={icon} />
      </div>
      <p className="mb-1 text-[20px] font-semibold text-ink">{title}</p>
      <p className="mb-4 text-muted">{hint}</p>
      {actionTo && (
        <Link to={actionTo}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
