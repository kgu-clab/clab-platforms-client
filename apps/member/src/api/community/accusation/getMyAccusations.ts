import type {
  ApiResponse,
  PagedResponse,
  PaginationParams,
} from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { AccuseMyResponseDto } from "./api.model";

export function getMyAccusations(params?: PaginationParams) {
  return authApi.get<ApiResponse<PagedResponse<AccuseMyResponseDto>>>(
    END_POINT.COMMUNITY.ACCUSATION.MY,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
