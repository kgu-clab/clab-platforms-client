import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardDetailsResponseDto } from "./api.model";

export function getBoard(boardId: number) {
  return authApi.get<ApiResponse<BoardDetailsResponseDto>>(
    END_POINT.COMMUNITY.BOARD.DETAIL(boardId),
  );
}
