export interface TokenRefreshDeps {
  baseURL: string;
  reissuePath: string;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  removeTokens: () => void;
  authorization: () => string;
  onHeadersUpdate: (headers: Record<string, string>) => void;
  parseReissueResponse: (res: Response) => Promise<{ accessToken: string; refreshToken: string }>;
  loginPath: string;
}

/**
 * 401 시 refresh 토큰으로 재발급 요청 후, 성공 시 저장 + onHeadersUpdate 호출하고
 * 원래 요청을 재시도하는 fetch 래퍼용 의존성.
 * 실제 재시도 로직은 client에서 이 deps를 사용해 구현.
 */
export function createTokenRefreshInterceptor(deps: TokenRefreshDeps) {
  return {
    ...deps,
    async tryReissue(): Promise<boolean> {
      const refreshToken = deps.getRefreshToken();
      if (!refreshToken) {
        deps.removeTokens();
        if (typeof window !== 'undefined') window.location.href = deps.loginPath;
        return false;
      }
      const fullUrl = deps.baseURL
        ? `${deps.baseURL.replace(/\/$/, '')}${deps.reissuePath}`
        : deps.reissuePath;
      const res = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        deps.removeTokens();
        if (typeof window !== 'undefined') window.location.href = deps.loginPath;
        return false;
      }
      const tokens = await deps.parseReissueResponse(res);
      deps.setTokens(tokens);
      deps.onHeadersUpdate({ Authorization: deps.authorization() });
      return true;
    },
  };
}
