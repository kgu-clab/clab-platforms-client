const ACCESS_TOKEN_KEY = "clab_member_access_token";
const REFRESH_TOKEN_KEY = "clab_member_refresh_token";

/**
 * 세션 스토리지에서 접근 토큰을 가져옵니다.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * 세션 스토리지에서 갱신 토큰을 가져옵니다.
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 세션 스토리지에 접근 토큰과 갱신 토큰을 저장합니다.
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * 세션 스토리지에서 접근 토큰과 갱신 토큰을 제거합니다.
 */
export function removeTokens(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * 인증에 사용될 Authorization 헤더 객체를 생성합니다.
 * @param token - 사용할 토큰. 없으면 null.
 */
export function authorization(token: string | null): Record<string, string> {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}
