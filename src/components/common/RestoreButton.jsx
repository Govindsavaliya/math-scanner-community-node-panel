import { Button, Icon } from "@/components/ui";

/** "Restore" action shown instead of Edit / Delete on soft-deleted rows. */
export default function RestoreButton({ onClick, className, label = "Restore" }) {
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={className}
    >
      <Icon name="restore" className="me-1.5 inline-block align-[-0.125em]" />
      {label}
    </Button>
  );
}
