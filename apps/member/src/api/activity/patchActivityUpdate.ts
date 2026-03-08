import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type { PatchActivityUpdateRequest } from "./api.model";

export const patchActivityUpdate = (
  activityGroupId: number,
  request: PatchActivityUpdateRequest,
) =>
  authApi.patch<BaseApiResponse<unknown>, PatchActivityUpdateRequest>(
    END_POINT.ACTIVITY.EDIT(activityGroupId),
    request,
  );
