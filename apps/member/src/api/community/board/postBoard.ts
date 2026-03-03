import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardRequestDto } from "./api.model";

export function postBoard(body: BoardRequestDto) {
  return authApi.post<ApiResponse<string>, BoardRequestDto>(
    END_POINT.COMMUNITY.BOARD.BASE,
    body,
  );
}
