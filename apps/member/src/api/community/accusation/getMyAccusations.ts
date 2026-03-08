import type { PaginationParams } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";
import type { BasePaginationResponse } from "@/api/config/api-base-types";

import type { AccuseMyResponseDto } from "./api.model";

export function getMyAccusations(params?: PaginationParams) {
  return authApi.get<BasePaginationResponse<AccuseMyResponseDto[]>>(
    END_POINT.COMMUNITY.ACCUSATION.MY,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
