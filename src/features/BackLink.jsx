import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

/** Round arrow button placed before a view page title; links to `to`, or runs `onClick`. */
export default function BackLink({ to, state, onClick }) {
  const props = to ? { as: Link, to, state } : { onClick };
  return (
    <Button size="icon-lg" className="me-4" aria-label="Back" {...props}>
      <Icon name="back" size={20} className="shrink-0" />
    </Button>
  );
}
