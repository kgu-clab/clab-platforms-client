import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";

import type { PostSupportRequest } from "./api.model";

export async function postSupport(body: PostSupportRequest["body"]) {
  const result = await authApi.post<
    ApiResponse<string>,
    PostSupportRequest["body"]
  >(END_POINT.SUPPORT.BASE, body);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
