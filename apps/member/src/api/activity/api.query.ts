import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type {
  ActivityCategory,
  ActivityStatus,
  GetActivitiyByCategoryRequest,
  GetActivitiyByStatusRequest,
  GetActivitiyDetailRequest,
  PostActivityApplyRequest,
  PostActivityCreateRequest,
  PatchActivityUpdateRequest,
} from "./api.model";
export type ActivityListFilter =
  | { type: "category"; category: ActivityCategory }
  | { type: "status"; status: ActivityStatus };
import { deleteActivity } from "./deleteActivity";
import { getActivityApplied } from "./getActivityApplied";
import { getActivityByCategory } from "./getActivityByCategory";
import { getActivityByStatus } from "./getActivityByStatus";
import { getActivityDetail } from "./getActivityDetail";
import { patchActivityUpdate } from "./patchActivityUpdate";
import { postActivityApply } from "./postActivityApply";
import { postActivityCreate } from "./postActivityCreate";

const activityQueryKey = ["activity"] as const;

export const activityQueries = {
  all: activityQueryKey,
  byCategoryKey: (request?: GetActivitiyByCategoryRequest) =>
    [...activityQueryKey, "category", request] as const,
  byStatusKey: (request?: GetActivitiyByStatusRequest) =>
    [...activityQueryKey, "status", request] as const,
  detailKey: (request: GetActivitiyDetailRequest) =>
    [...activityQueryKey, "detail", request.activityGroupId] as const,
  appliedKey: () => [...activityQueryKey, "applied"] as const,

  getActivityByCategoryQuery: (request: GetActivitiyByCategoryRequest) =>
    queryOptions({
      queryKey: activityQueries.byCategoryKey(request),
      queryFn: async () => {
        const res = await getActivityByCategory(request);
        if (!res.ok)
          throw new Error("카테고리별 활동 목록 조회에 실패했습니다.");
        return res.data.data;
      },
      staleTime: 60 * 60 * 1000,
    }),

  getActivityByStatusQuery: (request: GetActivitiyByStatusRequest) =>
    queryOptions({
      queryKey: activityQueries.byStatusKey(request),
      queryFn: async () => {
        const res = await getActivityByStatus(request);
        if (!res.ok) throw new Error("상태별 활동 목록 조회에 실패했습니다.");
        return res.data.data;
      },
      staleTime: 60 * 60 * 1000,
    }),

  getActivityDetailQuery: (request: GetActivitiyDetailRequest) =>
    queryOptions({
      queryKey: activityQueries.detailKey(request),
      queryFn: async () => {
        const res = await getActivityDetail(request);
        if (!res.ok) throw new Error("활동 상세 조회에 실패했습니다.");
        return res.data.data;
      },
      staleTime: 60 * 60 * 1000,
    }),

  getActivityAppliedQuery: () =>
    queryOptions({
      queryKey: activityQueries.appliedKey(),
      queryFn: async () => {
        const res = await getActivityApplied();
        if (!res.ok)
          throw new Error("활동 참여 신청 목록 조회에 실패했습니다.");
        return res.data.data;
      },
      staleTime: Number.POSITIVE_INFINITY, // invalidate 시에만 재요청
    }),

  postActivityApplyMutation: mutationOptions({
    mutationFn: async (request: PostActivityApplyRequest) => {
      const res = await postActivityApply(request);
      if (!res.ok)
        throw new Error(res.error.message ?? "활동 참여 신청에 실패했습니다.");
      return res.data;
    },
  }),

  postActivityCreateMutation: mutationOptions({
    mutationFn: async (request: PostActivityCreateRequest) => {
      const res = await postActivityCreate(request);
      if (!res.ok)
        throw new Error(res.error.message ?? "활동 생성에 실패했습니다.");
      return res.data;
    },
  }),

  patchActivityUpdateMutation: mutationOptions({
    mutationFn: async ({
      activityGroupId,
      ...request
    }: PatchActivityUpdateRequest & { activityGroupId: number }) => {
      const res = await patchActivityUpdate(activityGroupId, request);
      if (!res.ok)
        throw new Error(res.error.message ?? "활동 수정에 실패했습니다.");
      return res.data;
    },
  }),

  deleteActivityMutation: mutationOptions({
    mutationFn: async (activityGroupId: number) => {
      const res = await deleteActivity(activityGroupId);
      if (!res.ok)
        throw new Error(res.error.message ?? "활동 삭제에 실패했습니다.");
      return res.data;
    },
  }),
};
