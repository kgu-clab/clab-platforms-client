import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardRequestDto } from "./api.model";

export async function postBoard(body: BoardRequestDto) {
  const result = await authApi.post<ApiResponse<string>, BoardRequestDto>(
    END_POINT.COMMUNITY.BOARD.BASE,
    body,
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
