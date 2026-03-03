import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentResponseDto, GetCommentsParams } from "./api.model";

export function getComments({ boardId, ...params }: GetCommentsParams) {
  return authApi.get<ApiResponse<PagedResponse<CommentResponseDto>>>(
    END_POINT.COMMUNITY.COMMENT.BASE(boardId),
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
