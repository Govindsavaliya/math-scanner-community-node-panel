import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/lib/queryClient";
import { env } from "@/config/env";
import AppRoutes from "./router/routes";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer toastClassName="bg-surface text-ink" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {env.isDev && <ReactQueryDevtools buttonPosition="bottom-left" />}
    </QueryClientProvider>
  );
}
