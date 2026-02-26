import { type ApiResponseWithoutResult, baseApi, END_POINT } from "../config";
import type { PostLoginRequest } from "./api.model";

export const postLogin = (id: string, password: string) =>
  baseApi.post<ApiResponseWithoutResult, PostLoginRequest>(
    END_POINT.AUTH.LOGIN,
    {
      id,
      password,
    },
  );
