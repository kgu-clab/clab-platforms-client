import { authApi, END_POINT } from "@/api/config";

import type {
  GetActivitiyByStatusRequest,
  GetActivitiyByStatusResponse,
} from "./api.model";

export const getActivityByStatus = (request: GetActivitiyByStatusRequest) =>
  authApi.get<GetActivitiyByStatusResponse>(END_POINT.ACTIVITY.LIST_BY_STATUS, {
    searchParams: {
      status: request.status,
      page: request.page,
      size: request.size,
    },
  });
