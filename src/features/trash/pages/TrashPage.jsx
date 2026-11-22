import { useEffect, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import { Button, Card, Icon, Table } from "@/components/ui";
import PageHeader from "@/components/common/PageHeader";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { EmptyRow, TableLoader } from "@/components/common/DataState";
import { SkeletonRows } from "@/components/common/Skeleton";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/SearchInput";
import StatusBadge from "@/components/common/StatusBadge";
import { confirmDelete, confirmRestore } from "@/components/common/confirmDelete";
import { HEADING_ACTIONS, SEARCH_WIDTH } from "@/features/ui-classes";
import { notify } from "@/lib/notify";
import { cn } from "@/utils/cn";
import { dateFormat } from "@/utils/date";
import {
  useBulkPurgeTrash,
  useBulkRestoreTrash,
  useEmptyTrash,
  usePurgeTrashItem,
  useRestoreTrashItem,
  useTrashList,
  useTrashSummary,
} from "../api";
import { TRASH_MODULES, daysLeft, moduleLabel } from "../modules";
import TrashActivity from "../components/TrashActivity";
import TrashDetailsModal from "../components/TrashDetailsModal";
import TrashResultModal from "../components/TrashResultModal";
import { bulkResult, emptyResult } from "../results";

const PAGE_SIZE = 20;

const keyOf = (item) => `${item.module}:${item.id}`;
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const VIEWS = [
  { key: "items", label: "Deleted items" },
  { key: "activity", label: "Activity log" },
];

export default function TrashPage() {
  const [view, setView] = useState("items");
  const [module, setModule] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ search: "", startDate: "", endDate: "" });
  const [selected, setSelected] = useState(() => new Map());
  const [detailTarget, setDetailTarget] = useState(null);
  const [result, setResult] = useState(null);

  const baseParams = {
    search: filters.search || undefined,
    deleted_from: filters.startDate || undefined,
    deleted_to: filters.endDate || undefined,
  };
  const { data, error, isLoading, isFetching } = useTrashList({
    ...baseParams,
    module: module || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const { data: summaryData } = useTrashSummary(baseParams);

  const restoreItem = useRestoreTrashItem();
  const purgeItem = usePurgeTrashItem();
  const bulkRestore = useBulkRestoreTrash();
  const bulkPurge = useBulkPurgeTrash();
  const emptyTrash = useEmptyTrash();

  const items = data?.items ?? [];
  const total = data?.pagination?.total_records ?? 0;
  const retentionDays = data?.retention_days ?? summaryData?.retention_days ?? 30;
  const summary = summaryData?.summary ?? {};
  const grandTotal = Object.values(summary).reduce((sum, count) => sum + count, 0);
  const categoryOptions = [
    { label: `All categories (${grandTotal})`, value: "all" },
    ...TRASH_MODULES.map((entry) => ({ label: `${entry.label} (${summary[entry.key] ?? 0})`, value: entry.key })),
  ];
  const allOnPageSelected = items.length > 0 && items.every((item) => selected.has(keyOf(item)));

  useEffect(() => {
    // 403 means the admin's role does not allow viewing the trash.
    if (error) notify.error(error.message || "Failed to load the trash", { autoClose: 4000 });
  }, [error]);

  const clearSelection = () => setSelected(new Map());

  const resetList = () => {
    setPage(1);
    clearSelection();
  };

  const changeModule = (key) => {
    setModule(key);
    resetList();
  };

  const updateFilters = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    resetList();
  };

  const changePage = (next) => {
    setPage(next);
    clearSelection();
  };

  const toggleOne = (item) =>
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(keyOf(item))) next.delete(keyOf(item));
      else next.set(keyOf(item), { module: item.module, id: item.id });
      return next;
    });

  const toggleAllOnPage = () =>
    setSelected((prev) => {
      const next = new Map(prev);
      items.forEach((item) => {
        if (allOnPageSelected) next.delete(keyOf(item));
        else next.set(keyOf(item), { module: item.module, id: item.id });
      });
      return next;
    });

  const handleRestore = (item) =>
    confirmRestore(() => restoreItem.mutateAsync({ module: item.module, id: item.id }), {
      title: "Restore this item?",
      message: `"${item.title || `#${item.id}`}" will become active again.`,
    });

  const handlePurge = (item) =>
    confirmDelete(() => purgeItem.mutateAsync({ module: item.module, id: item.id }), {
      title: "Delete permanently?",
      message: `"${item.title || `#${item.id}`}" and what belongs to it will be removed for good. This cannot be undone.`,
      confirmButtonText: "Delete permanently",
    });

  const handleBulkRestore = async () => {
    const entries = [...selected.values()];
    let outcome;
    const ok = await confirmRestore(
      async () => {
        outcome = await bulkRestore.mutateAsync(entries);
      },
      { title: `Restore ${plural(entries.length, "item")}?`, confirmButtonText: "Restore selected" },
    );
    if (ok && outcome) {
      showResult(bulkResult("Restore finished", outcome));
      clearSelection();
    }
  };

  const handleBulkPurge = async () => {
    const entries = [...selected.values()];
    let outcome;
    const ok = await confirmDelete(
      async () => {
        outcome = await bulkPurge.mutateAsync(entries);
      },
      {
        title: `Delete ${plural(entries.length, "item")} permanently?`,
        message: "They will be removed for good, with what belongs to them. This cannot be undone.",
        confirmButtonText: "Delete selected",
      },
    );
    if (ok && outcome) {
      showResult(bulkResult("Permanent delete finished", outcome));
      clearSelection();
    }
  };

  const handleEmpty = async () => {
    let outcome;
    const scope = module ? moduleLabel(module).toLowerCase() : "items";
    const ok = await confirmDelete(
      async () => {
        outcome = await emptyTrash.mutateAsync({ module });
      },
      {
        title: "Empty the trash?",
        message: `Permanently deletes ${scope} that have been in the trash for ${retentionDays} days or more. Newer items are kept. This cannot be undone.`,
        confirmButtonText: "Empty trash",
      },
    );
    if (ok && outcome) {
      showResult(emptyResult(outcome));
      resetList();
    }
  };

  /** A clean outcome is a toast; the dialog is only for skipped / failed items that need details. */
  const showResult = (outcome) => {
    if (outcome.problems.length === 0) notify.success(outcome.lines[0], { autoClose: 3000 });
    else setResult(outcome);
  };

  const busy = bulkRestore.isPending || bulkPurge.isPending;

  return (
    <>
      <PageHeader
        title="Trash"
        description={`Deleted items stay here for ${retentionDays} days. Restore them, or delete them permanently.`}
        titleClassName="my-1"
        count={view === "items" ? total : undefined}
        actions={
          <div className={HEADING_ACTIONS}>
            <div role="tablist" aria-label="Trash view" className="flex rounded-lg border border-line bg-surface p-0.5">
              {VIEWS.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  role="tab"
                  aria-selected={view === entry.key}
                  onClick={() => setView(entry.key)}
                  className={cn(
                    "h-9 cursor-pointer rounded-md border-0 px-3 text-[13px] font-medium transition-colors",
                    view === entry.key ? "bg-primary/10 text-primary" : "bg-transparent text-muted hover:text-ink",
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            {view === "items" && (
              <Button variant="outline-danger" onClick={handleEmpty} disabled={total === 0 || busy}>
                Empty trash
              </Button>
            )}
          </div>
        }
      />

      {view === "activity" ? (
        <TrashActivity />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <SelectPicker
              container={() => document.body}
              cleanable={false}
              searchable={false}
              data={categoryOptions}
              value={module || "all"}
              onChange={(value) => changeModule(value === "all" ? "" : value)}
              className="w-full font-normal sm:w-60"
              placement="bottomStart"
              aria-label="Filter by category"
            />
            <SearchInput
              name="search"
              value={search}
              placeholder="Searching..."
              className={SEARCH_WIDTH}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => updateFilters({ search: search.trim() })}
              loading={isFetching}
              ariaLabel="Search the trash"
            />
            <DateRangeFilter startDate={filters.startDate} endDate={filters.endDate} onChange={updateFilters} />
            {selected.size > 0 && (
              <div className="flex w-full flex-wrap items-center gap-2 sm:ms-auto sm:w-auto">
                <span className="me-1 text-[14px] font-medium text-ink">{selected.size} selected</span>
                <Button onClick={handleBulkRestore} disabled={busy} className="inline-flex! h-10 items-center gap-2">
                  <Icon name="restore" size={16} />
                  Restore selected
                </Button>
                <Button variant="outline-danger" onClick={handleBulkPurge} disabled={busy} className="inline-flex! h-10 items-center gap-2">
                  <Icon name="trash" size={16} />
                  Delete selected
                </Button>
                <Button variant="ghost" onClick={clearSelection} className="h-10">
                  Clear
                </Button>
              </div>
            )}
          </div>

          <Card>
            <Card.Body>
              <TableLoader loading={isLoading || isFetching} />
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all on this page"
                        checked={allOnPageSelected}
                        disabled={items.length === 0}
                        onChange={toggleAllOnPage}
                        className="size-4 cursor-pointer accent-primary"
                      />
                    </th>
                    <th>Item</th>
                    <th>Module</th>
                    <th>Deleted</th>
                    <th>Retention</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && items.length === 0 && <SkeletonRows cols={6} />}
                  {!isLoading && items.length === 0 && (
                    <EmptyRow
                      title="The trash is empty"
                      hint="Items you delete in the panel show up here until you restore or remove them."
                      icon="trash"
                    />
                  )}
                  {items.map((item) => (
                    <tr key={keyOf(item)}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${item.title || `#${item.id}`}`}
                          checked={selected.has(keyOf(item))}
                          onChange={() => toggleOne(item)}
                          className="size-4 cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="max-w-90">
                        <p className="m-0 truncate font-medium text-ink" title={item.title || undefined}>
                          {item.title || `#${item.id}`}
                        </p>
                        {item.subtitle && <p className="m-0 truncate text-[12px] text-muted">{item.subtitle}</p>}
                      </td>
                      <td>
                        <StatusBadge tone="info" dot={false}>
                          {item.module_label || moduleLabel(item.module)}
                        </StatusBadge>
                      </td>
                      <td className="whitespace-nowrap text-muted">{item.deleted_at ? dateFormat(item.deleted_at) : "-"}</td>
                      <td className="whitespace-nowrap">
                        {item.eligible_for_purge ? (
                          <StatusBadge tone="warning">Eligible for cleanup</StatusBadge>
                        ) : (
                          <span className="text-muted">{plural(daysLeft(item.purge_after), "day")} left</span>
                        )}
                      </td>
                      <td className="text-center whitespace-nowrap">
                        <Button
                          variant="outline-secondary"
                          size="icon-sm"
                          className="me-2"
                          title="Details"
                          aria-label="Details"
                          onClick={() => setDetailTarget({ module: item.module, id: item.id })}
                        >
                          <Icon name="eye" />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="icon-sm"
                          className="me-2"
                          title="Restore"
                          aria-label="Restore"
                          onClick={() => handleRestore(item)}
                        >
                          <Icon name="restore" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="icon-sm"
                          title="Delete permanently"
                          aria-label="Delete permanently"
                          onClick={() => handlePurge(item)}
                        >
                          <Icon name="trash" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={changePage} />
            </Card.Body>
          </Card>
        </>
      )}

      <TrashDetailsModal
        target={detailTarget}
        onHide={() => setDetailTarget(null)}
        onRestore={handleRestore}
        onPurge={handlePurge}
      />
      <TrashResultModal result={result} onHide={() => setResult(null)} />
    </>
  );
}
