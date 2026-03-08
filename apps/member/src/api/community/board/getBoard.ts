import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { GetBoardDetailResponse } from "./api.model";

export function getBoard(boardId: number) {
  return authApi.get<ApiResponse<GetBoardDetailResponse>>(
    END_POINT.COMMUNITY.BOARD.DETAIL(boardId),
  );
}
