import { useCallback, useEffect } from 'react';

import { getTokens } from '@/lib/auth';

import { useIsLoggedInState } from './useIsLoggedIn';

export function useToken(): [
  accessToken: string | null,
  refreshToken: string | null,
  updateLogged: (logged: boolean) => void,
] {
  const [, setLoggedIn] = useIsLoggedInState();
  const tokens = getTokens();

  const updateLogged = useCallback(
    (logged: boolean) => {
      setLoggedIn(logged);
    },
    [setLoggedIn]
  );

  useEffect(() => {
    setLoggedIn(!!tokens?.accessToken);
  }, [tokens?.accessToken, setLoggedIn]);

  return [tokens?.accessToken ?? null, tokens?.refreshToken ?? null, updateLogged];
}
