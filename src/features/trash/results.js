import { moduleLabel } from "./modules";

const label = (entry) => `${moduleLabel(entry.module)} #${entry.id}`;

/** Result of `bulk-restore` / `bulk-delete` -> modal content. */
export const bulkResult = (title, data) => ({
  title,
  lines: [`${data.succeeded} of ${data.total} succeeded${data.failed ? `, ${data.failed} failed` : ""}.`],
  problems: (data.results ?? [])
    .filter((entry) => !entry.success)
    .map((entry) => ({ label: label(entry), message: entry.message, blockers: entry.blockers })),
});

/** Result of `empty` -> modal content. */
export const emptyResult = (data) => {
  const perModule = Object.entries(data.purged ?? {}).map(([key, count]) => `${moduleLabel(key)}: ${count}`);
  const lines = [
    `Permanently deleted ${data.purged_total} record${data.purged_total === 1 ? "" : "s"} that were in the trash for ${data.retention_days} days or more.`,
    ...perModule,
  ];
  if (data.limit_reached) lines.push("More records are eligible. Run Empty trash again to continue.");
  return {
    title: "Trash emptied",
    lines,
    problems: [...(data.skipped ?? []), ...(data.failed ?? [])].map((entry) => ({
      label: label(entry),
      message: entry.reason || entry.message,
      blockers: entry.blockers,
    })),
  };
};
