import { setHeaders, setTokenRefresh } from '@/api/client';

import { authConfig, parseReissueResponse } from './auth.config';
import { createTokenRefreshInterceptor } from './createTokenRefreshInterceptor';
import * as tokenStorage from '../model/auth/tokenStorage';

export { authConfig, authConfig as defaultAuthConfig };
export type { AuthConfig } from './auth.config';
export { createTokenRefreshInterceptor } from './createTokenRefreshInterceptor';
export type { TokenRefreshDeps } from './createTokenRefreshInterceptor';
export { isLoggedInAtom } from '../model/auth/authAtoms';
export {
  getTokens,
  setTokens,
  removeTokens,
  authorization,
  getAccessToken,
  getRefreshToken,
} from '../model/auth/tokenStorage';
export { useIsLoggedIn, useIsLoggedInState } from '../model/auth/useIsLoggedIn';
export { useToken } from '../model/auth/useToken';

/**
 * 앱 진입 시 한 번 호출. config 저장 + 401 시 reissue 후 재시도하는 인터셉터 등록.
 */
export function initAuth(config: typeof authConfig): void {
  tokenStorage.initAuth(config);
  const interceptor = createTokenRefreshInterceptor({
    baseURL: config.baseURL,
    reissuePath: config.reissuePath,
    getAccessToken: tokenStorage.getAccessToken,
    getRefreshToken: tokenStorage.getRefreshToken,
    setTokens: tokenStorage.setTokens,
    removeTokens: tokenStorage.removeTokens,
    authorization: tokenStorage.authorization,
    onHeadersUpdate: (headers) => setHeaders(headers),
    parseReissueResponse,
    loginPath: config.loginPath,
  });
  setTokenRefresh(interceptor);
}
