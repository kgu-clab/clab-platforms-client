// api response, request 타입 정의

export type postReissueTokenResponse = { accessToken: string };
export type PostLoginRequest = { id: string; password: string };

export type PostLoginResponse = {
  accessToken: string;
  refreshToken: string;
};
