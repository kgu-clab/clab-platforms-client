import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { JobPostingDetailsResponseDto } from "./api.model";

export function getJobPosting(jobPostingId: number) {
  return authApi.get<ApiResponse<JobPostingDetailsResponseDto>>(
    END_POINT.COMMUNITY.JOB_POSTING.DETAIL(jobPostingId),
  );
}
