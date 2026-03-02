import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentLikeToggleResponseDto } from "./api.model";

export function postCommentLike(commentId: number) {
  return authApi.post<ApiResponse<CommentLikeToggleResponseDto>, undefined>(
    END_POINT.COMMUNITY.COMMENT.LIKES(commentId),
    undefined,
  );
}
