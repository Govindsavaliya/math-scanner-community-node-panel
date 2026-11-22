import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/http";

export const dashboardKeys = {
  all: ["dashboard"],
};

/** Resolves with the full envelope: the page needs `response_code` (429 means "go to the website"). */
export const useDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.all,
    queryFn: () => request({ method: "GET", url: "/dashboard" }),
  });
