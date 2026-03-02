import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentUpdateRequestDto } from "./api.model";

export function patchComment(commentId: number, body: CommentUpdateRequestDto) {
  return authApi.patch<ApiResponse<number>, CommentUpdateRequestDto>(
    END_POINT.COMMUNITY.COMMENT.DETAIL(commentId),
    body,
  );
}
