import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { userQueries } from "@/api/user/api.query";
import { ROUTE } from "@/constants";

interface AdminGuardProps {
  children: ReactNode;
  /** roleLevel 기준. 기본 2 (운영진 이상) */
  minRoleLevel?: number;
}

export default function AdminGuard({
  children,
  minRoleLevel = 2,
}: AdminGuardProps) {
  const { data: userInfo, isLoading } = useQuery(
    userQueries.getUserInfoQuery(),
  );

  if (isLoading) {
    return null;
  }

  const roleLevel = userInfo?.data.roleLevel ?? 0;
  if (roleLevel < minRoleLevel) {
    return <Navigate to={ROUTE.HOME} replace />;
  }

  return <>{children}</>;
}
