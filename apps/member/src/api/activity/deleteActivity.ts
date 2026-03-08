import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

export const deleteActivity = (activityGroupId: number) =>
  authApi.del<BaseApiResponse<unknown>>(
    END_POINT.ACTIVITY.EDIT(activityGroupId),
  );
