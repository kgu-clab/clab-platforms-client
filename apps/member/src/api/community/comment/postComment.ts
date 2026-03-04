import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentRequestDto } from "./api.model";

export async function postComment(
  boardId: number,
  body: CommentRequestDto,
  parentId?: number,
) {
  const result = await authApi.post<ApiResponse<number>, CommentRequestDto>(
    END_POINT.COMMUNITY.COMMENT.BASE(boardId),
    body,
    {
      searchParams: parentId !== undefined ? { parentId } : undefined,
    },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
