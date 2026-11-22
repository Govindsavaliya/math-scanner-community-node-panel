import { toast } from "react-toastify";

const base = { position: "top-right", autoClose: 1000 };

export const notify = {
  success: (message, options) => toast.success(message, { ...base, ...options }),
  error: (message, options) => toast.error(message, { ...base, ...options }),
  loading: (message, options) => toast.loading(message, { ...base, autoClose: 500, ...options }),
  dismiss: toast.dismiss,
};
