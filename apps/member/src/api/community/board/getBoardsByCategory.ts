import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type {
  BoardListResponseDto,
  GetBoardsByCategoryParams,
} from "./api.model";

export function getBoardsByCategory(params: GetBoardsByCategoryParams) {
  const { category, page, size, sortBy, sortDirection } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("category", category);
  if (page !== undefined) searchParams.set("page", String(page));
  if (size !== undefined) searchParams.set("size", String(size));
  sortBy?.forEach((s) => searchParams.append("sortBy", s));
  sortDirection?.forEach((d) => searchParams.append("sortDirection", d));

  return authApi.get<ApiResponse<PagedResponse<BoardListResponseDto>>>(
    END_POINT.COMMUNITY.BOARD.CATEGORY,
    { searchParams },
  );
}
