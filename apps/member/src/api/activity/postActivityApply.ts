import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type { PostActivityApplyRequest } from "./api.model";

export const postActivityApply = (request: PostActivityApplyRequest) =>
  authApi.post<BaseApiResponse<unknown>, { applyReason: string }>(
    END_POINT.ACTIVITY.APPLY,
    { applyReason: request.applyReason },
    {
      searchParams: { activityGroupId: request.activityGroupId },
    },
  );
