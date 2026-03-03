import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentRequestDto } from "./api.model";

export function postComment(
  boardId: number,
  body: CommentRequestDto,
  parentId?: number,
) {
  return authApi.post<ApiResponse<number>, CommentRequestDto>(
    END_POINT.COMMUNITY.COMMENT.BASE(boardId),
    body,
    {
      searchParams: parentId !== undefined ? { parentId } : undefined,
    },
  );
}
