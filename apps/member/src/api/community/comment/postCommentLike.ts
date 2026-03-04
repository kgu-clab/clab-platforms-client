import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentLikeToggleResponseDto } from "./api.model";

export async function postCommentLike(commentId: number) {
  const result = await authApi.post<
    ApiResponse<CommentLikeToggleResponseDto>,
    undefined
  >(END_POINT.COMMUNITY.COMMENT.LIKES(commentId), undefined);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
