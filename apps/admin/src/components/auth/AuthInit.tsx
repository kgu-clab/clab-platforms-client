import { useEffect } from 'react';

import { setHeaders } from '@/api/client';
import { authorization } from '@/lib/auth';
import { useToken } from '@/model/auth/useToken';

/**
 * 앱 최상단에서 한 번 마운트. sessionStorage에 토큰이 있으면
 * server에 Authorization 헤더 설정 + 로그인 상태 동기화.
 */
export function AuthInit({ children }: { children: React.ReactNode }) {
  const [accessToken, , updateLogged] = useToken();

  useEffect(() => {
    if (accessToken) {
      setHeaders({ Authorization: authorization() });
      updateLogged(true);
    } else {
      updateLogged(false);
    }
  }, [accessToken, updateLogged]);

  return <>{children}</>;
}
