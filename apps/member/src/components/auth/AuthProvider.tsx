import { Navigate, Outlet } from "react-router";

import { useIsLoggedInState } from "@/model/auth";

import { ROUTE } from "@/constants";

interface AuthProviderProps {
  protect?: boolean;
}

export function AuthProvider({ protect = false }: AuthProviderProps) {
  const isLoggedIn = useIsLoggedInState();

  if (protect && !isLoggedIn) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }
  if (!protect && isLoggedIn) {
    return <Navigate to={ROUTE.HOME} replace />;
  }

  return <Outlet />;
}
