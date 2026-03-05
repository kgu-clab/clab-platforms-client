import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";

import type { PostAnswerRequest } from "./api.model";

export async function postAnswer(
  supportId: number,
  body: PostAnswerRequest["body"],
) {
  const result = await authApi.post<
    ApiResponse<string>,
    PostAnswerRequest["body"]
  >(END_POINT.SUPPORT.ANSWER(supportId), body);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
