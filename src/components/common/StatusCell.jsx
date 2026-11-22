import { STATUS_DELETED } from "@/config/constants";
import StatusBadge from "./StatusBadge";
import StatusSwitch from "./StatusSwitch";

/**
 * Status column cell: the ON/OFF switch, or a "Deleted" badge for soft-deleted rows
 * (those cannot be toggled until they are restored).
 *
 * @param {number} status
 * @param {number} [active]  Status value that means "active" (keys use 0).
 */
export default function StatusCell({ status, active = 1, onToggle, disabled }) {
  if (status === STATUS_DELETED) return <StatusBadge tone="danger">Deleted</StatusBadge>;
  return <StatusSwitch checked={status === active} onChange={onToggle} disabled={disabled} />;
}
