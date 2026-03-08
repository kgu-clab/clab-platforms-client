import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type { ActivityPosition } from "./api.model";

export const patchActivityMemberRole = (
  activityGroupId: number,
  memberId: string,
  position: ActivityPosition,
) =>
  authApi.patch<BaseApiResponse<unknown>, Record<string, never>>(
    END_POINT.ACTIVITY.MEMBER_ROLE,
    {},
    {
      searchParams: {
        activityGroupId,
        memberId,
        position,
      },
    },
  );
