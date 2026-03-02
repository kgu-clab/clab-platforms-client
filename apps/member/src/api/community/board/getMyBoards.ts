import type {
  ApiResponse,
  PagedResponse,
  PaginationParams,
} from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardMyResponseDto } from "./api.model";

export function getMyBoards(params?: PaginationParams) {
  return authApi.get<ApiResponse<PagedResponse<BoardMyResponseDto>>>(
    END_POINT.COMMUNITY.BOARD.MY_BOARDS,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
