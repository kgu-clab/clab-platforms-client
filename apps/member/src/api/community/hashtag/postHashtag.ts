import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { HashtagRequestDto } from "./api.model";

export function postHashtag(body: HashtagRequestDto) {
  return authApi.post<ApiResponse<number>, HashtagRequestDto>(
    END_POINT.COMMUNITY.HASHTAG.BASE,
    body,
  );
}
