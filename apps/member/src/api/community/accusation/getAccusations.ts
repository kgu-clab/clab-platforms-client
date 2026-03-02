import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { AccuseResponseDto, GetAccusationsParams } from "./api.model";

export function getAccusations(params?: GetAccusationsParams) {
  return authApi.get<ApiResponse<PagedResponse<AccuseResponseDto>>>(
    END_POINT.COMMUNITY.ACCUSATION.BASE,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
