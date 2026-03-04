import { queryOptions } from "@tanstack/react-query";

import type { PagedResponse } from "@/api/config";
import type {
  GetJobPostingsParams,
  JobPostingDetailsResponseDto,
  JobPostingResponseDto,
} from "./api.model";
import { getJobPosting } from "./getJobPosting";
import { getJobPostings } from "./getJobPostings";

export const jobPostingQueries = {
  getJobPostingsQuery: (params?: GetJobPostingsParams) =>
    queryOptions({
      queryKey: ["community", "jobPostings", params],
      queryFn: () => getJobPostings(params),
      select: (data): PagedResponse<JobPostingResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  getJobPostingQuery: (jobPostingId: number) =>
    queryOptions({
      queryKey: ["community", "jobPosting", jobPostingId],
      queryFn: () => getJobPosting(jobPostingId),
      select: (data): JobPostingDetailsResponseDto | null =>
        data.ok ? data.data.data : null,
    }),
};
