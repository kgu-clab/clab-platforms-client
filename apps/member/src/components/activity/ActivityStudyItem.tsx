import { Chip } from "@clab/design-system";
import { GoPeople } from "react-icons/go";
import { PiCrownSimpleFill } from "react-icons/pi";
import { Link } from "react-router";

import type { ActivityStatus } from "@/api/activity/api.model";
import type { Activity, ActivityByStatus } from "@/api/activity/api.type";
import { formatDate } from "@/utils/date";

type ActivityStudyItemProps = {
  activity: Activity | ActivityByStatus;
};

const STATUS_MAP: Record<
  ActivityStatus,
  { label: string; color: "green" | "yellow" | "red" }
> = {
  WAITING: { label: "모집중", color: "green" },
  PROGRESSING: { label: "진행중", color: "yellow" },
  END: { label: "종료", color: "red" },
};

function hasLeaders(
  activity: Activity | ActivityByStatus,
): activity is ActivityByStatus {
  return "leaders" in activity && "participantCount" in activity;
}

export default function ActivityStudyItem({
  activity,
}: ActivityStudyItemProps) {
  const { id, name, category, imageUrl } = activity;
  const status: ActivityStatus =
    "status" in activity ? activity.status : "PROGRESSING";
  const statusInfo = STATUS_MAP[status];
  const leaders = hasLeaders(activity) ? activity.leaders : [];
  const participantCount = hasLeaders(activity) ? activity.participantCount : 0;
  const leader = leaders[0];
  const leaderGeneration = leader?.id.slice(2, 4) ?? "";

  return (
    <Link
      to={`/activity/${id}`}
      className="bg-gray-0 border-gray-2 grid w-full grid-cols-[2fr_5fr] rounded-xl border"
    >
      <div className="bg-gray-2 overflow-hidden rounded-l-xl">
        <img
          src={imageUrl || "/images/clab.png"}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-xs p-gutter">
        <div className="text-16-medium line-clamp-1">{name}</div>
        <div className="text-14-regular text-gray-5 line-clamp-1">
          {formatDate(activity.createdAt)} 개설
        </div>
        <div className="gap-md text-12-regular text-gray-4 flex items-center">
          {leader && (
            <div className="gap-xs flex items-center">
              <PiCrownSimpleFill />
              {`${leader.name}(${leaderGeneration})`}
            </div>
          )}
          {participantCount > 0 && (
            <div className="gap-xs flex items-center">
              <GoPeople />
              {participantCount}
            </div>
          )}
        </div>
        <div className="gap-xs flex items-center">
          <Chip color="purple">
            {category === "PROJECT" ? "프로젝트" : "스터디"}
          </Chip>
          <Chip color={statusInfo.color}>{statusInfo.label}</Chip>
        </div>
      </div>
    </Link>
  );
}
