import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestData } from "@/lib/http";

const BASE = "/trash";

export const trashKeys = {
  all: ["trash"],
  list: (params) => ["trash", "list", params],
  summary: (params) => ["trash", "summary", params],
  detail: (module, id) => ["trash", "detail", module, String(id)],
  audit: (params) => ["trash", "audit", params],
};

/**
 * Trash endpoints answer with real HTTP codes (403 / 404 / 409). The 409 `blockers` explain what is in
 * the way, so they are appended to the message the confirm dialogs and toasts show.
 */
const withBlockers = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    const blockers = error?.data?.response_data?.blockers;
    if (Array.isArray(blockers) && blockers.length > 0) error.message = `${error.message}: ${blockers.join(" ")}`;
    throw error;
  }
};

/** Deleted records (`{ items, summary, retention_days, pagination }`); `module` is one module key or empty for all. */
export const useTrashList = (params) =>
  useQuery({
    queryKey: trashKeys.list(params),
    queryFn: () => requestData({ method: "GET", url: BASE, params }),
    placeholderData: keepPreviousData,
  });

/** Per-module totals for the tab badges (the filters without the module). */
export const useTrashSummary = (params) =>
  useQuery({
    queryKey: trashKeys.summary(params),
    queryFn: () => requestData({ method: "GET", url: BASE, params: { ...params, limit: 1 } }),
    placeholderData: keepPreviousData,
  });

/** One deleted record with dependencies, blockers and history. */
export const useTrashDetail = (module, id) =>
  useQuery({
    queryKey: trashKeys.detail(module, id),
    queryFn: () => requestData({ method: "GET", url: `${BASE}/${module}/${id}` }),
    enabled: Boolean(module && id),
  });

/** Audit log of restores / permanent deletes (`{ items, pagination }`). */
export const useTrashAudit = (params, { enabled = true } = {}) =>
  useQuery({
    queryKey: trashKeys.audit(params),
    queryFn: () => requestData({ method: "GET", url: `${BASE}/audit`, params }),
    placeholderData: keepPreviousData,
    enabled,
  });

/** Restoring / purging changes the lists of every module, so the whole cache is refreshed. */
const useTrashMutation = (mutationFn) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variables) => withBlockers(mutationFn(variables)),
    onSuccess: () => qc.invalidateQueries(),
  });
};

/** Restore one record as active. Pair with `confirmRestore`. */
export const useRestoreTrashItem = () =>
  useTrashMutation(({ module, id }) => requestData({ method: "POST", url: `${BASE}/${module}/${id}/restore` }));

/** Permanently delete one record in the trash. Pair with `confirmDelete`. */
export const usePurgeTrashItem = () =>
  useTrashMutation(({ module, id }) =>
    requestData({ method: "DELETE", url: `${BASE}/${module}/${id}`, params: { confirm: true } }),
  );

/** `items` is `[{ module, id }]` (max 100). Resolves with `{ total, succeeded, failed, results }`. */
export const useBulkRestoreTrash = () =>
  useTrashMutation((items) => requestData({ method: "POST", url: `${BASE}/bulk-restore`, data: { items } }));

export const useBulkPurgeTrash = () =>
  useTrashMutation((items) =>
    requestData({ method: "POST", url: `${BASE}/bulk-delete`, data: { items, confirm: true } }),
  );

/** Permanently deletes what has been in the trash for the retention period (optionally for one module). */
export const useEmptyTrash = () =>
  useTrashMutation(({ module } = {}) =>
    requestData({ method: "DELETE", url: `${BASE}/empty`, params: { confirm: true, module: module || undefined } }),
  );
