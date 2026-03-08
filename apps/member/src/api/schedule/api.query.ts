import { queryOptions } from "@tanstack/react-query";

import type { GetScheduleRequest } from "./api.model";
import { getSchedules } from "./getSchedules";

const scheduleQueryKey = ["schedule"] as const;

export const scheduleQueries = {
  all: scheduleQueryKey,
  listKey: (request: GetScheduleRequest) =>
    [...scheduleQueryKey, "list", request] as const,

  getSchedulesQuery: (request: GetScheduleRequest) =>
    queryOptions({
      queryKey: scheduleQueries.listKey(request),
      queryFn: async () => {
        const res = await getSchedules(request);
        if (!res.ok) throw new Error("일정 목록 조회에 실패했습니다.");
        return res.data.data;
      },
    }),
};
