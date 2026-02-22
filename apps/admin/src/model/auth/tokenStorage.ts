import type { AuthConfig } from '../../auth/auth.config';

let config: AuthConfig | null = null;

export function initAuth(c: AuthConfig): void {
  config = c;
}

function getConfig(): AuthConfig {
  if (!config) throw new Error('auth: initAuth(config) must be called before using tokenStorage');
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
