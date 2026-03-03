import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { GetJobPostingsParams, JobPostingResponseDto } from "./api.model";

export function getJobPostings(params?: GetJobPostingsParams) {
  return authApi.get<ApiResponse<PagedResponse<JobPostingResponseDto>>>(
    END_POINT.COMMUNITY.JOB_POSTING.BASE,
    {
      searchParams: params as unknown as Record<
        string,
        string | number | boolean
      >,
    },
  );
}
