import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { HotBoardListItem } from "./api.model";

export function getHotBoards() {
  return authApi.get<ApiResponse<HotBoardListItem[]>>(
    END_POINT.COMMUNITY.BOARD.HOT,
  );
}
