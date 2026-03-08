import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import type { ApiResponse, PagedResponse } from "@/api/config";
import { DEFAULT_PAGE_SIZE } from "@/api/config";

import type {
  GetJobPostingsParams,
  JobPostingDetailsResponseDto,
  JobPostingResponseDto,
} from "./api.model";
import { getJobPosting } from "./getJobPosting";
import { getJobPostings } from "./getJobPostings";

type GetJobPostingsResponse = ApiResponse<PagedResponse<JobPostingResponseDto>>;

export const jobPostingKeys = {
  all: ["community", "jobPostings"] as const,
  lists: ["community", "jobPostings", "list"] as const,
  infinite: (params?: Omit<GetJobPostingsParams, "page" | "size">) =>
    [...jobPostingKeys.lists, "infinite", params] as const,
};

export const jobPostingQueries = {
  getJobPostingsInfiniteQuery: (
    params?: Omit<GetJobPostingsParams, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: jobPostingKeys.infinite(params),
      queryFn: async ({ pageParam }) => {
        const res = await getJobPostings({
          ...params,
          page: pageParam as number,
          size: DEFAULT_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as GetJobPostingsResponse;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),

  getJobPostingQuery: (jobPostingId: number) =>
    queryOptions({
      queryKey: [...jobPostingKeys.all, jobPostingId],
      queryFn: () => getJobPosting(jobPostingId),
      select: (data): JobPostingDetailsResponseDto | null =>
        data.ok ? data.data.data : null,
    }),
};
