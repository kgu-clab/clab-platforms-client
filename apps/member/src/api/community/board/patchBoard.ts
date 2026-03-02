import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardUpdateRequestDto } from "./api.model";

export function patchBoard(boardId: number, body: BoardUpdateRequestDto) {
  return authApi.patch<ApiResponse<string>, BoardUpdateRequestDto>(
    END_POINT.COMMUNITY.BOARD.DETAIL(boardId),
    body,
  );
}
