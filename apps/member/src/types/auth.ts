/**
 * OAuth Custom Header Type : X-Clab-Auth
 * 토큰과 시크릿키 중 하나를 사용합니다.
 * 최초 로그인 시 시크릿키를 전달받고, 이후에는 토큰을 사용합니다.
 */
export type Token = {
  access: string;
  refresh: string;
};

export type SecretKey = {
  secretKey: string;
};

export type XClabAuth = Token | SecretKey;

/** reissue 응답 헤더 X-Clab-Auth에 담기는 토큰 형식 */
export type TokenFromHeader = {
  accessToken: string;
  refreshToken: string;
};
