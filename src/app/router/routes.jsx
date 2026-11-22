import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageLoader from "@/components/common/PageLoader";
import { GuestRoute, ProtectedRoute } from "./guards";
import { paths } from "./paths";

// Every page is code-split; the admin shell stays in the main bundle.
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const WebsitePage = lazy(() => import("@/features/website/pages/WebsitePage"));
const WebsiteContactPage = lazy(() => import("@/features/website/pages/ContactPage"));

const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const UsersPage = lazy(() => import("@/features/users/pages/UsersPage"));
const ContactUsPage = lazy(() => import("@/features/contact-us/pages/ContactUsPage"));

const MathsCommunityPage = lazy(() => import("@/features/maths-community/pages/MathsCommunityPage"));
const MathsCommunityAddPage = lazy(() => import("@/features/maths-community/pages/MathsCommunityAddPage"));
const MathsCommunityViewPage = lazy(() => import("@/features/maths-community/pages/MathsCommunityViewPage"));

const AdminUsersPage = lazy(() => import("@/features/admin-users/pages/AdminUsersPage"));
const TrashPage = lazy(() => import("@/features/trash/pages/TrashPage"));

const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.website} element={<WebsitePage />} />
          <Route path={paths.websiteContact} element={<WebsiteContactPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={paths.home} element={<DashboardPage />} />

            <Route path={paths.mathsCommunity.list} element={<MathsCommunityPage />} />
            <Route path={paths.mathsCommunity.add} element={<MathsCommunityAddPage />} />
            <Route path={paths.mathsCommunity.view()} element={<MathsCommunityViewPage />} />

            <Route path={paths.users} element={<UsersPage />} />
            <Route path={paths.contactUsData} element={<ContactUsPage />} />
            <Route path={paths.adminUsers} element={<AdminUsersPage />} />
            <Route path={paths.trash} element={<TrashPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={paths.login} replace />} />
      </Routes>
    </Suspense>
  );
}
