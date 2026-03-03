import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { AccuseRequestDto } from "./api.model";

export function postAccusation(body: AccuseRequestDto) {
  return authApi.post<ApiResponse<number>, AccuseRequestDto>(
    END_POINT.COMMUNITY.ACCUSATION.BASE,
    body,
  );
}
