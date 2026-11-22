import { Button, Icon, Modal } from "@/components/ui";
import StatusBadge from "@/components/common/StatusBadge";
import PageLoader from "@/components/common/PageLoader";
import { dateFormat } from "@/utils/date";
import { useTrashDetail } from "../api";
import { daysLeft, moduleLabel } from "../modules";

const LABEL = "mb-1 text-[12px] font-semibold tracking-wider text-muted uppercase";

const humanize = (key) => key.replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

const show = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

function Blockers({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="mb-4 rounded-lg border border-line bg-warning/10 p-3 text-[13px]">
      <p className="m-0 mb-1 flex items-center gap-2 font-medium text-ink">
        <Icon name="warning" className="text-warning" />
        {title}
      </p>
      <ul className="m-0 list-disc space-y-0.5 pl-5 text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Details of one trashed record: stored fields, what goes with it, why a restore / permanent delete
 * is blocked and its audit history. `onRestore` / `onPurge` receive the record and resolve true
 * once the action succeeded (the dialog then closes).
 */
export default function TrashDetailsModal({ target, onHide, onRestore, onPurge }) {
  const { data, isLoading, error } = useTrashDetail(target?.module, target?.id);

  const act = async (action) => {
    if (await action(data)) onHide();
  };

  return (
    <Modal show={Boolean(target)} onHide={onHide} size="lg">
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Trash details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <PageLoader page />}
        {error && <p className="m-0 text-danger">{error.message}</p>}
        {data && (
          <>
            <div className="mb-4">
              <p className="m-0 text-[16px] font-semibold break-words text-ink">{data.title || `#${data.id}`}</p>
              {data.subtitle && <p className="m-0 text-[13px] text-muted">{data.subtitle}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                <StatusBadge tone="info" dot={false}>
                  {data.module_label || moduleLabel(data.module)}
                </StatusBadge>
                <span>Deleted {data.deleted_at ? dateFormat(data.deleted_at) : "-"}</span>
                <span aria-hidden="true">&middot;</span>
                <span>
                  {data.eligible_for_purge
                    ? "Eligible for Empty trash"
                    : `${daysLeft(data.purge_after)} days until Empty trash can remove it`}
                </span>
              </div>
            </div>

            <Blockers title="Restore is blocked" items={data.restore_blockers} />
            <Blockers title="Permanent delete is blocked" items={data.purge_blockers} />

            {data.record && Object.keys(data.record).length > 0 && (
              <dl className="m-0 mb-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(data.record).map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <dt className={LABEL}>{humanize(key)}</dt>
                    <dd className="m-0 text-[14px] break-words whitespace-pre-wrap text-ink">{show(value)}</dd>
                  </div>
                ))}
              </dl>
            )}

            {data.dependencies && Object.keys(data.dependencies).length > 0 && (
              <div className="mb-4">
                <p className={LABEL}>Deleted together with it</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.dependencies).map(([key, count]) => (
                    <StatusBadge key={key} dot={false}>
                      {humanize(key)}: {count}
                    </StatusBadge>
                  ))}
                </div>
              </div>
            )}

            {data.history?.length > 0 && (
              <div>
                <p className={LABEL}>History</p>
                <ul className="m-0 list-none space-y-1 p-0 text-[13px] text-muted">
                  {data.history.map((entry, index) => (
                    <li key={entry.id ?? index}>
                      <span className="font-medium text-ink capitalize">{entry.action}</span>
                      {" · "}
                      {entry.created_at || entry.createdAt ? dateFormat(entry.created_at || entry.createdAt) : "-"}
                      {entry.user_id ? ` · admin #${entry.user_id}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-danger" disabled={!data?.can_purge} onClick={() => act(onPurge)}>
          Delete permanently
        </Button>
        <Button disabled={!data?.can_restore} onClick={() => act(onRestore)}>
          Restore
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
