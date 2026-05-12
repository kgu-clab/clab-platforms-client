import { Header, Scrollable, Section, Tabs, Title } from "@clab/design-system";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router";

import {
  ActivityAdminCard,
  AdminListState,
  AdminTabBadge,
} from "@/components/admin";
import { ConfirmModal } from "@/components/common";

import type {
  ActivityStatus,
  GetActivitiyByStatusResponse,
} from "@/api/activity/api.model";
import { activityQueries } from "@/api/activity/api.query";
import { ROUTE } from "@/constants";

const STATUS_TABS = [
  { value: "WAITING", label: "신청" },
  { value: "PROGRESSING", label: "진행" },
  { value: "END", label: "종료" },
] as const satisfies ReadonlyArray<{
  value: ActivityStatus;
  label: string;
}>;

type ActivityItem = GetActivitiyByStatusResponse["data"]["items"][number];

type PendingAction = {
  type: "approve" | "reject";
  activityGroupId: number;
  activityName: string;
};

export default function AdminActivityPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get("tab") ?? "WAITING") as ActivityStatus;
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const [waitingRes, progressingRes, endRes] = useQueries({
    queries: STATUS_TABS.map((t) =>
      activityQueries.getActivityByStatusQuery({
        activityGroupStatus: t.value,
        page: 0,
        size: 50,
      }),
    ),
  });

  const counts: Record<ActivityStatus, number> = {
    WAITING: waitingRes.data?.totalItems ?? 0,
    PROGRESSING: progressingRes.data?.totalItems ?? 0,
    END: endRes.data?.totalItems ?? 0,
  };

  const current =
    tab === "WAITING"
      ? waitingRes
      : tab === "PROGRESSING"
        ? progressingRes
        : endRes;

  const items: ActivityItem[] = current.data?.items ?? [];

  const statusMutation = useMutation({
    ...activityQueries.patchActivityStatusMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueries.all });
    },
  });

  const deleteMutation = useMutation({
    ...activityQueries.deleteActivityMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueries.all });
    },
  });

  const handleApprove = (id: number) => {
    statusMutation.mutate({
      activityGroupId: id,
      activityGroupStatus: "PROGRESSING",
    });
  };

  const handleReject = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEnd = (id: number) => {
    statusMutation.mutate({
      activityGroupId: id,
      activityGroupStatus: "END",
    });
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "approve") {
      handleApprove(pendingAction.activityGroupId);
    } else {
      handleReject(pendingAction.activityGroupId);
    }
    setPendingAction(null);
  };

  return (
    <>
      <Header
        left={
          <button
            type="button"
            onClick={() => navigate(ROUTE.ADMIN)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>활동 관리</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <div className="pt-header-height h-full overflow-y-auto">
        <Tabs>
          {STATUS_TABS.map((t, idx) => (
            <Tabs.Item
              key={t.value}
              label={t.label}
              href={
                idx === 0
                  ? ROUTE.ADMIN_ACTIVITY
                  : `${ROUTE.ADMIN_ACTIVITY}?tab=${t.value}`
              }
              endSlot={<AdminTabBadge count={counts[t.value]} />}
            />
          ))}
        </Tabs>

        <Scrollable className="px-gutter py-xl">
          <Section
            title={`${STATUS_TABS.find((t) => t.value === tab)?.label ?? ""} ${items.length}건`}
          >
            <AdminListState
              isPending={current.isPending}
              isError={current.isError}
              isEmpty={!current.isPending && items.length === 0}
              emptyMessage="해당 상태의 활동이 없습니다."
            />

            <div className="gap-md flex flex-col">
              {items.map((activity) => (
                <ActivityAdminCard
                  key={activity.id}
                  activity={activity}
                  status={tab}
                  isMutating={
                    statusMutation.isPending || deleteMutation.isPending
                  }
                  onApprove={() =>
                    setPendingAction({
                      type: "approve",
                      activityGroupId: activity.id,
                      activityName: activity.name,
                    })
                  }
                  onReject={() =>
                    setPendingAction({
                      type: "reject",
                      activityGroupId: activity.id,
                      activityName: activity.name,
                    })
                  }
                  onEnd={() => handleEnd(activity.id)}
                  onManage={() => navigate(ROUTE.ACTIVITY_MANAGE(activity.id))}
                  onDetail={() => navigate(`${ROUTE.ACTIVITY}/${activity.id}`)}
                />
              ))}
            </div>
          </Section>
        </Scrollable>
      </div>

      {pendingAction && (
        <ConfirmModal
          message={
            pendingAction.type === "approve"
              ? `"${pendingAction.activityName}" 활동을 승인하시겠습니까?`
              : `"${pendingAction.activityName}" 활동을 거절(삭제)하시겠습니까?`
          }
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
