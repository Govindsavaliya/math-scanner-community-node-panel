import axios from "axios";
import { env } from "@/config/env";
import { clearToken, getToken } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

// Auth failures reported with HTTP 200; a deleted or inactive admin also gets "Unauthorized access".
const LOGOUT_MESSAGES = new Set(["Session expired. Please login again.", "Unauthorized access", "Invalid token"]);

/** Error thrown for failed HTTP calls and for `response_code: false` envelopes. */
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message || "Something went wrong");
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const http = axios.create({ baseURL: env.apiUrl });

/** Public routes served at the API root (the website contact form and its list); everything else is under /admin. */
const PUBLIC_PATHS = new Set(["/contact-us", "/contact-us/list"]);
const ADMIN_PREFIX = "/admin";

/** Adds the `/admin` prefix to every panel route so callers can use the short paths from the API guide. */
const withAdminPrefix = (url = "") => {
  if (PUBLIC_PATHS.has(url) || url.startsWith(`${ADMIN_PREFIX}/`) || /^https?:/.test(url)) return url;
  return `${ADMIN_PREFIX}${url.startsWith("/") ? "" : "/"}${url}`;
};

http.interceptors.request.use((config) => {
  config.url = withAdminPrefix(config.url);
  return config;
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body?.response_code === false && getToken() && LOGOUT_MESSAGES.has(body?.response_message)) {
      clearToken();
      queryClient.clear();
      window.location.assign("/login");
    }
    return response;
  },
  (error) =>
    Promise.reject(
      new ApiError(error.response?.data?.response_message || error.message, {
        status: error.response?.status,
        data: error.response?.data,
      }),
    ),
);

/**
 * Performs a request and returns the response envelope
 * (`{ response_code, response_message, response_data }`).
 * Rejects with `ApiError` when the backend reports `response_code: false`.
 */
export async function request(config) {
  const { data } = await http.request(config);
  if (data?.response_code === false) {
    throw new ApiError(data.response_message, { status: 200, data });
  }
  return data;
}

/** Same as `request` but resolves with `response_data` only. */
export async function requestData(config) {
  const body = await request(config);
  return body.response_data;
}
