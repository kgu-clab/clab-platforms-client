import { queryOptions } from "@tanstack/react-query";

import type { PagedResponse } from "@/api/config";
import type {
  GetNewsParams,
  NewsDetailsResponseDto,
  NewsResponseDto,
} from "./api.model";
import { getNews } from "./getNews";
import { getNewsDetail } from "./getNewsDetail";

export const newsQueries = {
  getNewsQuery: (params?: GetNewsParams) =>
    queryOptions({
      queryKey: ["community", "news", params],
      queryFn: () => getNews(params),
      select: (data): PagedResponse<NewsResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  getNewsDetailQuery: (newsId: number) =>
    queryOptions({
      queryKey: ["community", "news", newsId],
      queryFn: () => getNewsDetail(newsId),
      select: (data): NewsDetailsResponseDto | null =>
        data.ok ? data.data.data : null,
    }),
};
