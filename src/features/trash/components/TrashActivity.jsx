import { useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import { Card, Table } from "@/components/ui";
import { EmptyRow, TableLoader } from "@/components/common/DataState";
import { SkeletonRows } from "@/components/common/Skeleton";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import { FILTER_SELECT } from "@/features/ui-classes";
import { dateFormat } from "@/utils/date";
import { useTrashAudit } from "../api";
import { moduleLabel } from "../modules";

const PAGE_SIZE = 20;
const ACTIONS = [
  { label: "All actions", value: "all" },
  { label: "Restore", value: "restore" },
  { label: "Permanent delete", value: "purge" },
  { label: "Empty trash", value: "empty" },
];
const TONES = { restore: "success", purge: "danger", empty: "warning" };

/** Audit log of restores and permanent deletes (who, what, when, from where). */
export default function TrashActivity() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("all");

  const { data, isLoading, isFetching } = useTrashAudit({
    page,
    limit: PAGE_SIZE,
    action: action === "all" ? undefined : action,
  });
  const rows = data?.items ?? [];
  const total = data?.pagination?.total_records ?? 0;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <SelectPicker
          container={() => document.body}
          cleanable={false}
          searchable={false}
          data={ACTIONS}
          value={action}
          onChange={(value) => {
            setAction(value);
            setPage(1);
          }}
          className={FILTER_SELECT}
          placement="bottomEnd"
          aria-label="Filter by action"
        />
      </div>
      <Card>
        <Card.Body>
          <TableLoader loading={isLoading || isFetching} />
          <Table bordered responsive>
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Module</th>
                <th>Item</th>
                <th>Admin</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 && <SkeletonRows cols={6} />}
              {!isLoading && rows.length === 0 && (
                <EmptyRow title="No activity yet" hint="Restores and permanent deletes are listed here." icon="history" />
              )}
              {rows.map((entry) => (
                <tr key={entry.id}>
                  <td className="whitespace-nowrap text-muted">{entry.created_at || entry.createdAt ? dateFormat(entry.created_at || entry.createdAt) : "-"}</td>
                  <td>
                    <StatusBadge tone={TONES[entry.action] ?? "neutral"} className="capitalize">
                      {entry.action}
                    </StatusBadge>
                  </td>
                  <td>{moduleLabel(entry.module)}</td>
                  <td className="max-w-90 truncate" title={entry.record_label || undefined}>
                    {entry.record_label || (entry.record_id ? `#${entry.record_id}` : "-")}
                  </td>
                  <td className="text-muted">{entry.user_id ? `#${entry.user_id}` : "-"}</td>
                  <td className="text-muted">{entry.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </Card.Body>
      </Card>
    </>
  );
}
