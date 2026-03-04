import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { AccuseRequestDto } from "./api.model";

export async function postAccusation(body: AccuseRequestDto) {
  const result = await authApi.post<ApiResponse<number>, AccuseRequestDto>(
    END_POINT.COMMUNITY.ACCUSATION.BASE,
    body,
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
