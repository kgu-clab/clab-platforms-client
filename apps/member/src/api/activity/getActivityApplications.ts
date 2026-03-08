import { authApi, END_POINT } from "@/api/config";

import type {
  GetActivityApplicationsRequest,
  GetActivityApplicationsResponse,
} from "./api.model";

export const getActivityApplications = (
  request: GetActivityApplicationsRequest,
) =>
  authApi.get<GetActivityApplicationsResponse>(
    END_POINT.ACTIVITY.APPLICATIONS,
    {
      searchParams: {
        activityGroupId: request.activityGroupId,
        page: request.page ?? 0,
        size: request.size ?? 20,
      },
    },
  );
