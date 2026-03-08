import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import { DEFAULT_PAGE_SIZE } from "@/api/config";

import type {
  ActivityCategory,
  ActivityPosition,
  ActivityStatus,
  GetActivitiyByCategoryRequest,
  GetActivitiyByStatusRequest,
  GetActivitiyDetailRequest,
  GetActivityApplicationsRequest,
  PatchActivityChangeStatusRequest,
  PatchActivityMemberStatusRequest,
  PatchActivityUpdateRequest,
  PostActivityApplyRequest,
  PostActivityCreateRequest,
} from "./api.model";
export type ActivityListFilter =
  | { type: "category"; category: ActivityCategory }
  | { type: "status"; status: ActivityStatus };
import { deleteActivity } from "./deleteActivity";
import { getActivityApplications } from "./getActivityApplications";
import { getActivityApplied } from "./getActivityApplied";
import { getActivityByCategory } from "./getActivityByCategory";
import { getActivityByStatus } from "./getActivityByStatus";
import { getActivityDetail } from "./getActivityDetail";
import { patchActivityMemberRole } from "./patchActivityMemberRole";
import { patchActivityMemberStatus } from "./patchActivityMemberStatus";
import { patchActivityStatus } from "./patchActivityStatus";
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
  applicationsKey: (request: GetActivityApplicationsRequest) =>
    [...activityQueryKey, "applications", request.activityGroupId] as const,

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

  getActivityApplicationsQuery: (request: GetActivityApplicationsRequest) =>
    queryOptions({
      queryKey: activityQueries.applicationsKey(request),
      queryFn: async () => {
        const res = await getActivityApplications({
          ...request,
          page: request.page ?? 0,
          size: request.size ?? DEFAULT_PAGE_SIZE,
        });
        if (!res.ok) throw new Error("지원서 목록 조회에 실패했습니다.");
        return res.data.data?.items ?? [];
      },
      staleTime: 60 * 1000,
    }),

  getActivityApplicationsInfiniteQuery: (
    request: Omit<GetActivityApplicationsRequest, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: activityQueries.applicationsKey(request),
      queryFn: async ({ pageParam }) => {
        const res = await getActivityApplications({
          ...request,
          page: pageParam as number,
          size: DEFAULT_PAGE_SIZE,
        });
        if (!res.ok) throw new Error("지원서 목록 조회에 실패했습니다.");
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage?.data?.hasNext ? lastPage.data.currentPage + 1 : undefined,
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

  patchActivityMemberRoleMutation: mutationOptions({
    mutationFn: async ({
      activityGroupId,
      memberId,
      position,
    }: {
      activityGroupId: number;
      memberId: string;
      position: ActivityPosition;
    }) => {
      const res = await patchActivityMemberRole(
        activityGroupId,
        memberId,
        position,
      );
      if (!res.ok)
        throw new Error(res.error.message ?? "직책 변경에 실패했습니다.");
      return res.data;
    },
  }),

  patchActivityStatusMutation: mutationOptions({
    mutationFn: async ({
      activityGroupId,
      activityGroupStatus,
    }: PatchActivityChangeStatusRequest) => {
      const res = await patchActivityStatus(
        activityGroupId,
        activityGroupStatus,
      );
      if (!res.ok)
        throw new Error(res.error.message ?? "활동 상태 변경에 실패했습니다.");
      return res.data;
    },
  }),

  patchActivityMemberStatusMutation: mutationOptions({
    mutationFn: async (request: PatchActivityMemberStatusRequest) => {
      const res = await patchActivityMemberStatus(request);
      if (!res.ok)
        throw new Error(res.error.message ?? "멤버 상태 변경에 실패했습니다.");
      return res.data;
    },
  }),
};
