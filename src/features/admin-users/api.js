import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request, requestData } from "@/lib/http";
import { notify } from "@/lib/notify";

const adminUsersKeys = {
  all: ["admin-users"],
  list: (params) => ["admin-users", "list", params],
};

/** Paginated admin accounts (`{ adminUsers, pagination }`). Super admins only (403 otherwise). */
export const useAdminUsers = (params) =>
  useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => requestData({ method: "POST", url: "/admin-user-list", data: params }),
    placeholderData: keepPreviousData,
  });

/** Soft delete; the account can no longer sign in. Pair with `confirmDelete`. */
export const useDeleteAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "DELETE", url: `/admin-user/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      qc.invalidateQueries({ queryKey: ["trash"] });
      notify.success("Admin user deleted successfully");
    },
  });
};

/** Restores a deleted admin as active. Pair with `confirmRestore`. */
export const useRestoreAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: `/admin-user/restore/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      qc.invalidateQueries({ queryKey: ["trash"] });
      notify.success("Admin user restored successfully");
    },
  });
};
