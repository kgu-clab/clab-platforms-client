/** API 공통 응답 (member와 동일) */
export type ApiResponse<T> = {
  code: string;
  message: string;
  result: T;
};

export type ApiResponseWithoutResult = {
  code: string;
  message: string;
};

export type postLoginRequest = { id: string; password: string };
export type postReissueTokenResponse = { accessToken: string; refreshToken?: string };
