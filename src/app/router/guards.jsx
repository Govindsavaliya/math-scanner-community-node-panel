import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { paths } from "./paths";

/** Admin area: redirects visitors without a session to the login page. */
export function ProtectedRoute() {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }
  return <Outlet />;
}

/** Website + login: signed-in users are sent straight to the dashboard. */
export function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to={paths.home} replace />;
  }
  return <Outlet />;
}
