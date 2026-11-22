import { QueryClient } from "@tanstack/react-query";

const NO_RETRY_STATUS = new Set([400, 401, 403, 404, 422]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        failureCount < 1 && !NO_RETRY_STATUS.has(error?.status),
    },
    mutations: { retry: false },
  },
});
