import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request, requestData } from "@/lib/http";
import { notify } from "@/lib/notify";

const usersKeys = {
  all: ["users"],
  lists: () => ["users", "list"],
  list: (params) => ["users", "list", params],
};

/** Paginated + filtered users (`{ users, pagination }`). */
export const useUsers = (params) =>
  useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => requestData({ method: "POST", url: "/users", data: params }),
    placeholderData: keepPreviousData,
  });

/** Soft delete (status 2); pair with `confirmDelete`. */
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "DELETE", url: `/user/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
      notify.success("Delete user successfully");
    },
  });
};

/** Brings a soft-deleted user back as active; pair with `confirmRestore`. */
export const useRestoreUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: `/user/restore/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
      notify.success("User restored successfully");
    },
  });
};

/** Flips a user's status optimistically; rolls back and shows the legacy error toast on failure. */
export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: `/user/status/${id}` }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: usersKeys.lists() });
      const snapshots = qc.getQueriesData({ queryKey: usersKeys.lists() });
      qc.setQueriesData({ queryKey: usersKeys.lists() }, (old) =>
        old?.users
          ? {
              ...old,
              users: old.users.map((u) =>
                u.id === id ? { ...u, status: u.status === 1 ? 0 : 1 } : u,
              ),
            }
          : old,
      );
      return { snapshots };
    },
    onError: (_error, _id, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
      notify.error("Update Data Failed");
    },
    onSuccess: () => notify.success("Update Data successfully"),
    onSettled: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
};
