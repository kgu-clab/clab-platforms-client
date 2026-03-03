import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { NewsDetailsResponseDto } from "./api.model";

export function getNewsDetail(newsId: number) {
  return authApi.get<ApiResponse<NewsDetailsResponseDto>>(
    END_POINT.COMMUNITY.NEWS.DETAIL(newsId),
  );
}
