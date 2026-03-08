import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import type { ApiResponse, PagedResponse } from "@/api/config";
import { DEFAULT_PAGE_SIZE } from "@/api/config";

import type {
  GetNewsParams,
  NewsDetailsResponseDto,
  NewsResponseDto,
} from "./api.model";
import { getNews } from "./getNews";
import { getNewsDetail } from "./getNewsDetail";

type GetNewsResponse = ApiResponse<PagedResponse<NewsResponseDto>>;

export const newsKeys = {
  all: ["community", "news"] as const,
  lists: ["community", "news", "list"] as const,
  infinite: (params?: Omit<GetNewsParams, "page" | "size">) =>
    [...newsKeys.lists, "infinite", params] as const,
};

export const newsQueries = {
  getNewsInfiniteQuery: (params?: Omit<GetNewsParams, "page" | "size">) =>
    infiniteQueryOptions({
      queryKey: newsKeys.infinite(params),
      queryFn: async ({ pageParam }) => {
        const res = await getNews({
          ...params,
          page: pageParam as number,
          size: DEFAULT_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as GetNewsResponse;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),

  getNewsDetailQuery: (newsId: number) =>
    queryOptions({
      queryKey: [...newsKeys.all, newsId],
      queryFn: () => getNewsDetail(newsId),
      select: (data): NewsDetailsResponseDto | null =>
        data.ok ? data.data.data : null,
    }),
};
