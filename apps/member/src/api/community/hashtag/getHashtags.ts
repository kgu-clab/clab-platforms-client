import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { HashtagResponseDto } from "./api.model";

export function getHashtags() {
  return authApi.get<ApiResponse<HashtagResponseDto[]>>(
    END_POINT.COMMUNITY.HASHTAG.BASE,
  );
}
