import type { PostLoginRequest } from "./api.model";
import { baseApi, END_POINT, type ApiResponseWithoutResult } from "../config";

export function postLogin(id: string, password: string) {
  return baseApi.post<ApiResponseWithoutResult, PostLoginRequest>(
    END_POINT.AUTH.LOGIN,
    {
      id,
      password,
    },
  );
}
