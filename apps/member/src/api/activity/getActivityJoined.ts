import { authApi, END_POINT } from "@/api/config";

import type {
  GetActivityJoinedRequest,
  GetActivitiyByStatusResponse,
} from "./api.model";

export const getActivityJoined = (request: GetActivityJoinedRequest) =>
  authApi.get<GetActivitiyByStatusResponse>(
    END_POINT.ACTIVITY.MY_ACTIVITY_JOINED,
    {
      searchParams: {
        status: request.status,
        page: request.page,
        size: request.size,
      },
    },
  );
