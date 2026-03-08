import { queryOptions } from "@tanstack/react-query";

import type {
  GetActivitiyByCategoryRequest,
  GetActivitiyByStatusRequest,
  GetActivitiyDetailRequest,
} from "./api.model";
import { getActivityByCategory } from "./getActivityByCategory";
import { getActivityByStatus } from "./getActivityByStatus";
import { getActivityDetail } from "./getActivityDetail";

const activityQueryKey = ["activity"] as const;

export const activityQueries = {
  all: activityQueryKey,
  byCategoryKey: (request?: GetActivitiyByCategoryRequest) =>
    [...activityQueryKey, "category", request] as const,
  byStatusKey: (request?: GetActivitiyByStatusRequest) =>
    [...activityQueryKey, "status", request] as const,
  detailKey: (request: GetActivitiyDetailRequest) =>
    [...activityQueryKey, "detail", request.activityGroupId] as const,

  getActivityByCategoryQuery: (request: GetActivitiyByCategoryRequest) =>
    queryOptions({
      queryKey: activityQueries.byCategoryKey(request),
      queryFn: async () => {
        const res = await getActivityByCategory(request);
        if (!res.ok)
          throw new Error("카테고리별 활동 목록 조회에 실패했습니다.");
        return res.data.data;
      },
    }),

  getActivityByStatusQuery: (request: GetActivitiyByStatusRequest) =>
    queryOptions({
      queryKey: activityQueries.byStatusKey(request),
      queryFn: async () => {
        const res = await getActivityByStatus(request);
        if (!res.ok) throw new Error("상태별 활동 목록 조회에 실패했습니다.");
        return res.data.data;
      },
    }),

  getActivityDetailQuery: (request: GetActivitiyDetailRequest) =>
    queryOptions({
      queryKey: activityQueries.detailKey(request),
      queryFn: async () => {
        const res = await getActivityDetail(request);
        if (!res.ok) throw new Error("활동 상세 조회에 실패했습니다.");
        return res.data.data;
      },
    }),
};
