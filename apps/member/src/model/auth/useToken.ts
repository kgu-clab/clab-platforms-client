import { useMemo } from "react";

import { getAccessToken, getRefreshToken } from "@/utils/auth";

export function useToken(): [string | null, string | null] {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return useMemo(
    () => [accessToken ?? null, refreshToken ?? null],
    [accessToken, refreshToken],
  );
}
