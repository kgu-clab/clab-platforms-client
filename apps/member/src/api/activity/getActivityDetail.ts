import { authApi, END_POINT } from "@/api/config";

import type {
  GetActivitiyDetailRequest,
  GetActivitiyDetailResponse,
} from "./api.model";

export const getActivityDetail = (request: GetActivitiyDetailRequest) =>
  authApi.get<GetActivitiyDetailResponse>(
    END_POINT.ACTIVITY.DETAIL(request.activityGroupId),
  );
