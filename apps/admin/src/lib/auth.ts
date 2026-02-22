import { setHeaders, setTokenRefresh } from '@/api/client';
import type { AuthConfig } from '@/constants/config/auth';
import { authConfig, parseReissueResponse } from '@/constants/config/auth';

// --- token storage (config set by initAuth) ---
let config: AuthConfig | null = null;

export function initAuth(c: AuthConfig): void {
  config = c;
}

function getConfig(): AuthConfig {
  if (!config) throw new Error('auth: initAuth(config) must be called before using token storage');
  return config;
}

export function getTokens(): { accessToken: string; refreshToken: string } | null {
  if (typeof window === 'undefined') return null;
  const c = getConfig();
  const accessToken = sessionStorage.getItem(c.accessTokenKey);
  const refreshToken = sessionStorage.getItem(c.refreshTokenKey);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  if (typeof window === 'undefined') return;
  const c = getConfig();
  sessionStorage.setItem(c.accessTokenKey, tokens.accessToken);
  sessionStorage.setItem(c.refreshTokenKey, tokens.refreshToken);
}

export function removeTokens(): void {
  if (typeof window === 'undefined') return;
  const c = getConfig();
  sessionStorage.removeItem(c.accessTokenKey);
  sessionStorage.removeItem(c.refreshTokenKey);
}

export function authorization(): string {
  const tokens = getTokens();
  if (!tokens?.accessToken) return '';
  return `Bearer ${tokens.accessToken}`;
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return getTokens()?.refreshToken ?? null;
}

// --- token refresh interceptor ---
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

/**
 * 앱 진입 시 한 번 호출. config 저장 + 401 시 reissue 후 재시도하는 인터셉터 등록.
 */
export function setupAuth(c: AuthConfig = authConfig): void {
  initAuth(c);
  const interceptor = createTokenRefreshInterceptor({
    baseURL: c.baseURL,
    reissuePath: c.reissuePath,
    getAccessToken,
    getRefreshToken,
    setTokens,
    removeTokens,
    authorization,
    onHeadersUpdate: (headers) => setHeaders(headers),
    parseReissueResponse,
    loginPath: c.loginPath,
  });
  setTokenRefresh(interceptor);
}
