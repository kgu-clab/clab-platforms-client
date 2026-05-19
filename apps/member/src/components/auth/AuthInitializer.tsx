import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useIsLoggedIn } from "@/model/auth";
import { useAuthStore } from "@/model/common";

import { postReissueToken } from "@/api/auth/postReissueToken";
import { userQueries } from "@/api/user/api.query";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from "@/utils/auth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { updateLogged } = useIsLoggedIn();
  const queryClient = useQueryClient();
  const setMemberId = useAuthStore((s) => s.setMemberId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreMemberId = async () => {
      try {
        const userInfo = await queryClient.fetchQuery({
          ...userQueries.getUserInfoQuery(),
        });
        setMemberId(userInfo.data.id);
      } catch {
        // 사용자 정보 조회 실패 시에도 로그인 상태는 유지, 나중에 로그아웃 처리가 필요하다면 그 때 추가할깨요.
      }
    };

    const initialize = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && refreshToken) {
        updateLogged(true);
        await restoreMemberId();
        return;
      }

      if (refreshToken) {
        try {
          const { accessToken: newAccess, refreshToken: newRefresh } =
            await postReissueToken(refreshToken);
          setTokens(newAccess, newRefresh);
          updateLogged(true);
          await restoreMemberId();
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
  }, [updateLogged, queryClient, setMemberId]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
