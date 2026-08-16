import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { RecruitmentDetailsResponseDto } from "./api.model";

export function getRecruitmentDetails(recruitmentId: number) {
  return authApi.get<ApiResponse<RecruitmentDetailsResponseDto>>(
    END_POINT.RECRUITMENT.DETAIL(recruitmentId),
  );
}
