import { authApi, END_POINT } from "@/api/config";

import type { GetSupportDetailResponse } from "./api.model";

export function getSupportDetail(supportId: number) {
  return authApi.get<GetSupportDetailResponse>(
    END_POINT.SUPPORT.DETAIL(supportId),
  );
}
