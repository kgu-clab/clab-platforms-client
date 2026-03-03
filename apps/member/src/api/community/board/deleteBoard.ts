import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

export async function deleteBoard(boardId: number) {
  const result = await authApi.del<ApiResponse<string>>(
    END_POINT.COMMUNITY.BOARD.DETAIL(boardId),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
