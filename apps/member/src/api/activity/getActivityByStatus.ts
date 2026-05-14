import { authApi, END_POINT } from "@/api/config";

import type {
  GetActivitiyByStatusRequest,
  GetActivitiyByStatusResponse,
} from "./api.model";

export const getActivityByStatus = (request: GetActivitiyByStatusRequest) =>
  authApi.get<GetActivitiyByStatusResponse>(END_POINT.ACTIVITY.LIST_BY_STATUS, {
    searchParams: {
      activityGroupStatus: request.activityGroupStatus,
      page: request.page,
      size: request.size,
    },
  });
