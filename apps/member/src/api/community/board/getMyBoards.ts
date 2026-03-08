import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { GetMyBoardsRequest, MyBoardListItem } from "./api.model";

export function getMyBoards(params?: GetMyBoardsRequest) {
  return authApi.get<ApiResponse<PagedResponse<MyBoardListItem>>>(
    END_POINT.COMMUNITY.BOARD.MY_BOARDS,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
