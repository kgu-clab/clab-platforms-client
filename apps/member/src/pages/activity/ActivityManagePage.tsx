import { Header, Scrollable } from "@clab/design-system";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";

import { useInfiniteScroll } from "@/model/common/useInfiniteScroll";

import ActivityManageApplicationList from "@/components/activity/ActivityManageApplicationList";
import ActivityManageMemberList from "@/components/activity/ActivityManageMemberList";

import { activityQueries } from "@/api/activity/api.query";
import type { ActivityGroupMember } from "@/api/activity/api.type";
import { ROUTE } from "@/constants";

export default function ActivityManagePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const activityGroupId = id != null ? Number(id) : NaN;

  const {
    data: detail,
    isPending,
    isError,
  } = useQuery({
    ...activityQueries.getActivityDetailQuery({ activityGroupId }),
    enabled: Number.isFinite(activityGroupId),
  });

  const {
    data: applicationsData,
    isError: applicationsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...activityQueries.getActivityApplicationsInfiniteQuery({
      activityGroupId,
    }),
    enabled: Number.isFinite(activityGroupId) && !!detail?.isOwner,
    retry: false,
  });

  const applications =
    applicationsData?.pages.flatMap((p) => p.data?.items ?? []) ?? [];

  const { scrollRef, bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const roleMutation = useMutation({
    ...activityQueries.patchActivityMemberRoleMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityQueries.detailKey({ activityGroupId }),
      });
      queryClient.invalidateQueries({
        queryKey: activityQueries.applicationsKey({ activityGroupId }),
      });
    },
  });

  const handleBack = () => navigate(-1);

  const handleRoleChange = (member: ActivityGroupMember, newRole: string) => {
    if (member.role === newRole) return;
    roleMutation.mutate({
      activityGroupId,
      memberId: member.memberId,
      position: newRole as "LEADER" | "MEMBER",
    });
  };

  if (!Number.isFinite(activityGroupId)) {
    return (
      <Scrollable>
        <Header
          left={
            <button className="focus:outline-none" onClick={handleBack}>
              <GoChevronLeft size={24} />
            </button>
          }
        />
        <div className="px-gutter py-gutter text-14-regular text-gray-5">
          잘못된 경로입니다.
        </div>
      </Scrollable>
    );
  }

  if (isPending) {
    return (
      <Scrollable>
        <Header
          left={
            <button className="focus:outline-none" onClick={handleBack}>
              <GoChevronLeft size={24} />
            </button>
          }
        />
        <div className="px-gutter py-gutter text-14-regular text-gray-5">
          로딩 중...
        </div>
      </Scrollable>
    );
  }

  if (isError || !detail) {
    return (
      <Scrollable>
        <Header
          left={
            <button className="focus:outline-none" onClick={handleBack}>
              <GoChevronLeft size={24} />
            </button>
          }
        />
        <div className="px-gutter py-gutter text-14-regular text-red-5">
          활동 정보를 불러오지 못했습니다.
        </div>
      </Scrollable>
    );
  }

  if (!detail.isOwner) {
    navigate(`${ROUTE.ACTIVITY}/${activityGroupId}`, { replace: true });
    return null;
  }

  const members = Array.isArray(detail.groupMembers)
    ? [...detail.groupMembers]
    : [];

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide pb-bottom-padding flex size-full flex-col overflow-y-auto"
    >
      <Header
        left={
          <button className="focus:outline-none" onClick={handleBack}>
            <GoChevronLeft size={24} />
          </button>
        }
        className="fixed left-0 right-0 top-0 z-10 bg-white"
      />
      <div className="gap-3xl pt-[calc(var(--spacing-header-height)+16px)]">
        <ActivityManageMemberList
          members={members}
          onRoleChange={handleRoleChange}
        />

        <ActivityManageApplicationList
          applications={applications}
          isError={applicationsError}
          isFetchingNextPage={isFetchingNextPage}
        />
        <div ref={bottomSentinelRef} />
      </div>
    </div>
  );
}
