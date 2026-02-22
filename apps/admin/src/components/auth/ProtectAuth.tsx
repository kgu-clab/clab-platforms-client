import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { useIsLoggedIn } from '@/model/auth/useIsLoggedIn';

interface ProtectAuthProps {
  children: React.ReactNode;
  protect?: boolean;
  loginPath?: string;
  mainPath?: string;
}

export function ProtectAuth({
  children,
  protect = true,
  loginPath = '/login',
  mainPath = '/',
}: ProtectAuthProps) {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (protect && !isLoggedIn) {
      navigate(loginPath, { state: { from: location }, replace: true });
      return;
    }
    if (!protect && isLoggedIn) {
      navigate(mainPath, { replace: true });
    }
  }, [protect, isLoggedIn, loginPath, mainPath, navigate, location]);

  if (protect && !isLoggedIn) return null;
  if (!protect && isLoggedIn) return null;
  return <>{children}</>;
}
