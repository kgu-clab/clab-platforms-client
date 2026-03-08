import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type { PatchActivityMemberStatusRequest } from "./api.model";

export const patchActivityMemberStatus = (
  request: PatchActivityMemberStatusRequest,
) =>
  authApi.patch<BaseApiResponse<unknown>, Record<string, never>>(
    END_POINT.ACTIVITY.MEMBER_STATUS,
    {},
    {
      searchParams: {
        activityGroupId: request.activityGroupId,
        memberId: request.memberId,
        status: request.status,
      },
    },
  );
