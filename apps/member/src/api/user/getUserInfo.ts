import { authApi, END_POINT } from "../config";
import type { getUserInfoResponse } from "./api.model";

export const getUserInfo = () =>
  authApi.get<getUserInfoResponse>(END_POINT.USER.INFO);
