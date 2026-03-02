import type {
  ApiResponse,
  PagedResponse,
  PaginationParams,
} from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { CommentResponseDto } from "./api.model";

export function getMyComments(params?: PaginationParams) {
  return authApi.get<ApiResponse<PagedResponse<CommentResponseDto>>>(
    END_POINT.COMMUNITY.COMMENT.MY_COMMENTS,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
