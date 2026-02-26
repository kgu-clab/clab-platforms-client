import { useEffect, useState } from "react";

import { useIsLoggedIn, useToken } from "@/model/auth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [accessToken, refreshToken] = useToken();
  const { updateLogged } = useIsLoggedIn();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken && refreshToken) {
      updateLogged(true);
    } else {
      updateLogged(false);
    }
    queueMicrotask(() => setIsLoading(false));
  }, [accessToken, refreshToken, updateLogged]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
