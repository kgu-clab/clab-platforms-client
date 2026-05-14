import { Button, Chip } from "@clab/design-system";
import { GoPeople } from "react-icons/go";
import { PiCrownSimpleFill } from "react-icons/pi";

import type {
  ActivityStatus,
  GetActivitiyByStatusResponse,
} from "@/api/activity/api.model";
import { formatDate } from "@/utils/date";

type ActivityItem = GetActivitiyByStatusResponse["data"]["items"][number];

interface ActivityAdminCardProps {
  activity: ActivityItem;
  status: ActivityStatus;
  isMutating: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEnd: () => void;
  onManage: () => void;
  onDetail: () => void;
}

export default function ActivityAdminCard({
  activity,
  status,
  isMutating,
  onApprove,
  onReject,
  onEnd,
  onManage,
  onDetail,
}: ActivityAdminCardProps) {
  const leader = activity.leaders?.[0];

  return (
    <div className="border-gray-2 gap-md flex flex-col rounded-xl border bg-white p-4">
      <div className="gap-xs flex items-center">
        <Chip color="purple">
          {activity.category === "PROJECT" ? "프로젝트" : "스터디"}
        </Chip>
        <Chip
          color={
            status === "WAITING"
              ? "disabled"
              : status === "PROGRESSING"
                ? "green"
                : "red"
          }
        >
          {status === "WAITING"
            ? "신청 대기"
            : status === "PROGRESSING"
              ? "진행 중"
              : "종료"}
        </Chip>
      </div>

      <button
        type="button"
        className="text-16-medium text-left text-black"
        onClick={onDetail}
      >
        {activity.name}
      </button>

      <div className="gap-md text-12-regular text-gray-4 flex items-center">
        {leader && (
          <div className="gap-xs flex items-center">
            <PiCrownSimpleFill />
            {leader.name}
          </div>
        )}
        {activity.participantCount > 0 && (
          <div className="gap-xs flex items-center">
            <GoPeople />
            {activity.participantCount}
          </div>
        )}
        <span>{formatDate(activity.createdAt)} 개설</span>
      </div>

      <div className="gap-sm flex flex-wrap justify-end">
        {status === "WAITING" && (
          <>
            <Button
              size="small"
              color="outlineActive"
              onClick={onReject}
              disabled={isMutating}
            >
              거절
            </Button>
            <Button size="small" onClick={onApprove} disabled={isMutating}>
              승인
            </Button>
          </>
        )}
        {status === "PROGRESSING" && (
          <>
            <Button size="small" color="outlineActive" onClick={onManage}>
              신청자 관리
            </Button>
            <Button size="small" onClick={onEnd} disabled={isMutating}>
              종료 처리
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
