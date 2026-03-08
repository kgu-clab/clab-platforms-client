import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type {
  ActivityPosition,
  PatchActivityMemberRoleRequest,
} from "./api.model";

export const patchActivityMemberRole = (
  activityGroupId: number,
  memberId: string,
  position: ActivityPosition,
) =>
  authApi.patch<BaseApiResponse<unknown>, PatchActivityMemberRoleRequest>(
    END_POINT.ACTIVITY.MEMBER_ROLE,
    { activityGroupId, memberId, position },
  );
