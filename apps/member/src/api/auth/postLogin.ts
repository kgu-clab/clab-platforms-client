import type { PostLoginRequest } from "./api.model";
import { baseApi, END_POINT, type ApiResponseWithoutResult } from "../config";

export async function postLogin(id: string, password: string) {
  const result = await baseApi.post<ApiResponseWithoutResult, PostLoginRequest>(
    END_POINT.AUTH.LOGIN,
    {
      id,
      password,
    },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
