import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentUpdateRequestDto } from "./api.model";

export async function patchComment(
  commentId: number,
  body: CommentUpdateRequestDto,
) {
  const result = await authApi.patch<
    ApiResponse<number>,
    CommentUpdateRequestDto
  >(END_POINT.COMMUNITY.COMMENT.DETAIL(commentId), body);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
