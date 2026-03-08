import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type {
  ActivityStatus,
  PatchActivityChangeStatusRequest,
} from "./api.model";

export const patchActivityStatus = (
  activityGroupId: number,
  activityGroupStatus: ActivityStatus,
) =>
  authApi.patch<BaseApiResponse<unknown>, PatchActivityChangeStatusRequest>(
    END_POINT.ACTIVITY.CHANGE_STATUS(activityGroupId),
    { activityGroupId, activityGroupStatus },
  );
