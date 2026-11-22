import { useMutation } from "@tanstack/react-query";
import { request } from "@/lib/http";
import { setToken } from "@/lib/auth";
import { notify } from "@/lib/notify";

/** POST /admin_login. Stores the JWT, toasts and lets the caller navigate via `onSuccess`. */
export function useLogin({ onSuccess } = {}) {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const body = await request({
        url: "/admin_login",
        method: "post",
        data: { email, password },
      });
      if (!body?.response_code) throw new Error(body?.response_message);
      return body;
    },
    onSuccess: (body, variables) => {
      notify.success("Login Successfully");
      setToken(body.response_data.token);
      onSuccess?.(body, variables);
    },
    onError: (error) => notify.error(error.message || "Login failed"),
  });
}
