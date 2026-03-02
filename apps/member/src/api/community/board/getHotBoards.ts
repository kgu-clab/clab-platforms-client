import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardHotListResponseDto } from "./api.model";

export function getHotBoards() {
  return authApi.get<ApiResponse<BoardHotListResponseDto[]>>(
    END_POINT.COMMUNITY.BOARD.HOT,
  );
}
