import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type { PatchActivityChangeStatusRequest } from "./api.model";

export const patchActivityStatus = ({
  activityGroupId,
  activityGroupStatus,
}: PatchActivityChangeStatusRequest) =>
  authApi.patch<BaseApiResponse<unknown>, undefined>(
    END_POINT.ACTIVITY.CHANGE_STATUS(activityGroupId),
    undefined,
    { searchParams: { activityGroupStatus } },
  );
