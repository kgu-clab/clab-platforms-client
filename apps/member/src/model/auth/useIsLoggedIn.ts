import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import { isLoggedInAtom, setIsLoggedInAtom } from "./auth-atom";

export function useIsLoggedIn() {
  const setIsLoggedIn = useSetAtom(setIsLoggedInAtom);

  const updateLogged = useCallback(
    (logged: boolean) => {
      setIsLoggedIn(logged);
    },
    [setIsLoggedIn],
  );

  return { updateLogged } as const;
}

export function useIsLoggedInState() {
  return useAtomValue(isLoggedInAtom);
}
