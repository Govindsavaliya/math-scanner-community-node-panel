import { useMutation } from "@tanstack/react-query";
import { request } from "@/lib/http";

/**
 * POST /contact-us (public website form, no /admin prefix, no token).
 * Uses the shared API client, so unlike the old page it goes to the API base URL.
 */
export function useSendContactMessage() {
  return useMutation({
    mutationFn: (formData) =>
      request({
        url: "/contact-us",
        method: "post",
        data: formData,
        headers: {
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
        },
      }),
  });
}
