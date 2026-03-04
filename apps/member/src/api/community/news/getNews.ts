import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { GetNewsParams, NewsResponseDto } from "./api.model";

export function getNews(params?: GetNewsParams) {
  return authApi.get<ApiResponse<PagedResponse<NewsResponseDto>>>(
    END_POINT.COMMUNITY.NEWS.BASE,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
