import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

export function deleteBoard(boardId: number) {
  return authApi.del<ApiResponse<string>>(
    END_POINT.COMMUNITY.BOARD.DETAIL(boardId),
  );
}
