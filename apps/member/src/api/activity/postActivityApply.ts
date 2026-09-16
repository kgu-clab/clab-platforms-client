import { authApi, END_POINT } from "@/api/config";

import type {
  ActivityMutationResponse,
  PostActivityApplyRequest,
} from "./api.model";

export const postActivityApply = (request: PostActivityApplyRequest) =>
  authApi.post<ActivityMutationResponse, { applyReason: string }>(
    END_POINT.ACTIVITY.APPLY,
    { applyReason: request.applyReason },
    {
      searchParams: { activityGroupId: request.activityGroupId },
    },
  );
