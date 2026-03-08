import { authApi, END_POINT } from "@/api/config";

import type { GetScheduleRequest, GetScheduleResponse } from "./api.model";

export const getSchedules = (request: GetScheduleRequest) =>
  authApi.get<GetScheduleResponse>(END_POINT.SCHEDULE.BASE, {
    searchParams: {
      startDate: request.startDate,
      endDate: request.endDate,
      page: request.page,
      size: request.size,
    },
  });
