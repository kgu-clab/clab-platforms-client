import { useEffect, useState } from "react";

import { useIsLoggedIn } from "@/model/auth";

import { postReissueToken } from "@/api/auth/postReissueToken";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from "@/utils/auth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { updateLogged } = useIsLoggedIn();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && refreshToken) {
        updateLogged(true);
        return;
      }

      if (refreshToken) {
        try {
          const { accessToken: newAccess, refreshToken: newRefresh } =
            await postReissueToken(refreshToken);
          setTokens(newAccess, newRefresh);
          updateLogged(true);
        } catch {
          removeTokens();
          updateLogged(false);
        }
        return;
      }

      updateLogged(false);
    };

    initialize().finally(() => {
      queueMicrotask(() => setIsLoading(false));
    });
  }, [updateLogged]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
