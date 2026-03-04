import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardUpdateRequestDto } from "./api.model";

export async function patchBoard(boardId: number, body: BoardUpdateRequestDto) {
  const result = await authApi.patch<
    ApiResponse<string>,
    BoardUpdateRequestDto
  >(END_POINT.COMMUNITY.BOARD.DETAIL(boardId), body);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
