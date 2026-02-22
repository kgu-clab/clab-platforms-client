import { API_BASE_URL } from '@/constants/api';

/** reissue 응답에서 access/refresh 토큰을 꺼내는 함수 (백엔드 형식에 맞게 수정) */
export function parseReissueResponse(res: Response): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  return res
    .json()
    .then(
      (body: {
        result?: { accessToken?: string; refreshToken?: string };
        accessToken?: string;
        refresh_token?: string;
      }) => {
        const result = body.result ?? body;
        const accessToken =
          result.accessToken ?? (result as { accessToken?: string }).accessToken ?? '';
        const refreshToken =
          (result as { refreshToken?: string }).refreshToken ??
          (body as { refresh_token?: string }).refresh_token ??
          '';
        return { accessToken, refreshToken };
      }
    );
}

export const authConfig = {
  accessTokenKey: 'clab_admin_access_token',
  refreshTokenKey: 'clab_admin_refresh_token',
  reissuePath: '/v1/auth/reissue',
  baseURL: API_BASE_URL,
  loginPath: '/login',
  mainPath: '/',
} as const;

export type AuthConfig = typeof authConfig;
