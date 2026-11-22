import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request, requestData } from "@/lib/http";
import { notify } from "@/lib/notify";

export const contactUsKeys = {
  all: ["contact-us"],
  list: (params) => ["contact-us", "list", params],
};

/** Paginated + filtered contact submissions (`{ contactUs, pagination }`). */
export const useContactUs = (params) =>
  useQuery({
    queryKey: contactUsKeys.list(params),
    queryFn: () => requestData({ method: "POST", url: "/contact-us/list", data: params }),
    placeholderData: keepPreviousData,
  });

/** Soft delete (status 2); pair with `confirmDelete`. Needs the admin token (the list itself is public). */
export const useDeleteContactUs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "DELETE", url: `/contact-us/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactUsKeys.all });
      notify.success("Delete message successfully");
    },
  });
};

/** Brings a soft-deleted message back; pair with `confirmRestore`. */
export const useRestoreContactUs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: `/contact-us/restore/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactUsKeys.all });
      notify.success("Message restored successfully");
    },
  });
};
