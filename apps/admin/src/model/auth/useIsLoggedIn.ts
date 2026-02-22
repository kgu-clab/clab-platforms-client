import { useAtom, useAtomValue } from 'jotai';

import { isLoggedInAtom } from './authAtoms';

export function useIsLoggedIn(): boolean {
  return useAtomValue(isLoggedInAtom);
}

export function useIsLoggedInState(): [boolean, (value: boolean) => void] {
  return useAtom(isLoggedInAtom);
}
