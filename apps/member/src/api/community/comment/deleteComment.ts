import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

export async function deleteComment(commentId: number) {
  const result = await authApi.del<ApiResponse<number>>(
    END_POINT.COMMUNITY.COMMENT.DETAIL(commentId),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
