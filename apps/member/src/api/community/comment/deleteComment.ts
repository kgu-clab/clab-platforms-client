import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

export function deleteComment(commentId: number) {
  return authApi.del<ApiResponse<number>>(
    END_POINT.COMMUNITY.COMMENT.DETAIL(commentId),
  );
}
