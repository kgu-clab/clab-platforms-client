import { createBrowserRouter } from "react-router";

import { AdminGuard } from "@/components/admin";
import { AuthProvider } from "@/components/auth";

import { ROUTE } from "@/constants";
import {
  ActivityHomePage,
  HomePage,
  StudyDetailPage,
  CommunityDetailPage,
  CommunityPage,
  LibraryPage,
  LibraryDetailPage,
  LibraryCreatePage,
  CommunityWritePage,
  ActivityCreatePage,
  ActivityEditPage,
  ActivityManagePage,
  MyPage,
  MyPostsPage,
  MyCommentsPage,
  MyLibraryPage,
  MyActivityPage,
  SupportDetailPage,
  SupportPage,
  SupportWritePage,
  LoginPage,
  AdminHomePage,
  AdminSupportPage,
  AdminActivityPage,
  AdminLibraryPage,
  AdminReportPage,
  AdminMemberPage,
} from "@/pages";

import ActivityLayout from "../layout/ActivityLayout";
import CommunityLayout from "../layout/CommunityLayout";
import RootLayout from "../layout/RootLayout";

const authRoutes = [
  {
    path: ROUTE.LOGIN,
    element: <LoginPage />,
  },
];

const activityRoutes = [
  {
    path: ROUTE.ACTIVITY,
    element: <ActivityLayout />,
    children: [{ index: true, element: <ActivityHomePage /> }],
  },
  {
    path: `${ROUTE.ACTIVITY}/:id`,
    element: <StudyDetailPage />,
  },
  {
    path: `${ROUTE.ACTIVITY}/:id/edit`,
    element: <ActivityEditPage />,
  },
  {
    path: `${ROUTE.ACTIVITY}/:id/manage`,
    element: <ActivityManagePage />,
  },
  {
    path: ROUTE.ACTIVITY_CREATE,
    element: <ActivityCreatePage />,
  },
];

const communityRoutes = [
  {
    path: ROUTE.COMMUNITY,
    element: <CommunityLayout />,
    children: [{ index: true, element: <CommunityPage /> }],
  },
  { path: `${ROUTE.COMMUNITY}/:id`, element: <CommunityDetailPage /> },
  {
    path: ROUTE.COMMUNITY_WRITE,
    element: <CommunityWritePage />,
  },
];

const libraryRoutes = [
  { path: ROUTE.LIBRARY, element: <LibraryPage /> },
  { path: `${ROUTE.LIBRARY}/:id`, element: <LibraryDetailPage /> },
  {
    path: ROUTE.LIBRARY_CREATE,
    element: <LibraryCreatePage />,
  },
];

const myRoutes = [
  {
    path: ROUTE.MY,
    element: <MyPage />,
  },
  {
    path: ROUTE.MY_POSTS,
    element: <MyPostsPage />,
  },
  {
    path: ROUTE.MY_COMMENTS,
    element: <MyCommentsPage />,
  },
  {
    path: ROUTE.MY_LIBRARY,
    element: <MyLibraryPage />,
  },
  {
    path: ROUTE.MY_ACTIVITY,
    element: <MyActivityPage />,
  },
];

const supportRoutes = [
  {
    path: ROUTE.SUPPORT,
    element: <SupportPage />,
  },
  {
    path: `${ROUTE.SUPPORT}/:id`,
    element: <SupportDetailPage />,
  },
  {
    path: ROUTE.SUPPORT_WRITE,
    element: <SupportWritePage />,
  },
];

const adminRoutes = [
  {
    path: ROUTE.ADMIN,
    element: (
      <AdminGuard>
        <AdminHomePage />
      </AdminGuard>
    ),
  },
  {
    path: ROUTE.ADMIN_SUPPORT,
    element: (
      <AdminGuard>
        <AdminSupportPage />
      </AdminGuard>
    ),
  },
  {
    path: `${ROUTE.ADMIN_SUPPORT}/:id`,
    element: (
      <AdminGuard>
        <SupportDetailPage />
      </AdminGuard>
    ),
  },
  {
    path: ROUTE.ADMIN_ACTIVITY,
    element: (
      <AdminGuard>
        <AdminActivityPage />
      </AdminGuard>
    ),
  },
  {
    path: ROUTE.ADMIN_LIBRARY,
    element: (
      <AdminGuard>
        <AdminLibraryPage />
      </AdminGuard>
    ),
  },
  {
    path: ROUTE.ADMIN_REPORT,
    element: (
      <AdminGuard>
        <AdminReportPage />
      </AdminGuard>
    ),
  },
  {
    path: ROUTE.ADMIN_MEMBER,
    element: (
      <AdminGuard>
        <AdminMemberPage />
      </AdminGuard>
    ),
  },
];

const protectedRoutes = [
  {
    element: <AuthProvider protect />,
    children: [
      { index: true, element: <HomePage /> },
      ...activityRoutes,
      ...communityRoutes,
      ...libraryRoutes,
      ...myRoutes,
      ...supportRoutes,
      ...adminRoutes,
    ],
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [...authRoutes, ...protectedRoutes],
  },
]);
