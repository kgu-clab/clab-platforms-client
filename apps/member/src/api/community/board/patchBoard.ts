import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { PatchBoardRequest } from "./api.model";

export async function patchBoard(boardId: number, body: PatchBoardRequest) {
  const result = await authApi.patch<ApiResponse<string>, PatchBoardRequest>(
    END_POINT.COMMUNITY.BOARD.DETAIL(boardId),
    body,
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
