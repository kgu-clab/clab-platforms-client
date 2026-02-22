import { server } from '@/api/client';
import { END_POINT } from '@/constants/api';

import type { ApiResponse } from './api.model';
import type { postLoginRequest } from './api.model';

export type PostLoginResult = { accessToken: string; refreshToken: string };

export async function postLogin(body: postLoginRequest): Promise<PostLoginResult> {
  const { data } = await server.post<postLoginRequest, ApiResponse<PostLoginResult>>({
    url: END_POINT.AUTH.LOGIN,
    body,
  });
  return data.result;
}
