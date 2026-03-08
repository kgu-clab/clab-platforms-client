import { Chip, Section } from "@clab/design-system";
import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";

import type { SchedulePriority } from "@/api/schedule/api.model";
import type { Schedule } from "@/api/schedule/api.type";

const PRIORITY_LABEL: Record<SchedulePriority, string> = {
  HIGH: "중요",
  MEDIUM: "보통",
  LOW: "낮음",
};

const PRIORITY_CHIP_COLOR: Record<
  SchedulePriority,
  "red" | "yellow" | "primary" | "disabled"
> = {
  HIGH: "red",
  MEDIUM: "yellow",
  LOW: "disabled",
};

interface ActivityScheduleListProps {
  schedules: Schedule[];
  selectedDate: Date;
}

export default function ActivityScheduleList({
  schedules,
  selectedDate,
}: ActivityScheduleListProps) {
  const selectedKey = dayjs(selectedDate).format("YYYY-MM-DD");
  const filteredSchedules = schedules.filter(
    (s) => dayjs(s.startDateTime).format("YYYY-MM-DD") === selectedKey,
  );

  return (
    <Section.List>
      {filteredSchedules.length === 0 ? (
        <p className="text-14-regular text-gray-4 py-md text-center">
          해당 날짜에 일정이 없습니다.
        </p>
      ) : (
        filteredSchedules.map((schedule) => (
          <ScheduleListItem key={schedule.id} schedule={schedule} />
        ))
      )}
    </Section.List>
  );
}

function ScheduleListItem({ schedule }: { schedule: Schedule }) {
  const start = dayjs(schedule.startDateTime);
  const end = dayjs(schedule.endDateTime);
  const timeLabel =
    start.format("HH:mm") === end.format("HH:mm")
      ? start.format("HH:mm")
      : `${start.format("HH:mm")} - ${end.format("HH:mm")}`;

  return (
    <div className="bg-gray-0 border-gray-2 gap-2xl p-gutter box-border flex w-full rounded-xl border">
      <div className="text-20-semibold text-gray-5 px-sm flex flex-col items-center justify-center leading-tight">
        {start.format("DD")}
        <br />
        {start.format("MM")}
      </div>
      <div className="space-y-sm">
        <div className="text-16-medium">{schedule.title}</div>
        {schedule.detail ? (
          <p className="text-13-regular text-gray-5 line-clamp-2">
            {schedule.detail}
          </p>
        ) : null}
        <div className="gap-md text-12-regular text-gray-4 flex items-center">
          <div className="gap-xs flex items-center">
            <FiClock />
            {timeLabel}
          </div>
          {schedule.activityName ? (
            <span className="text-gray-5">{schedule.activityName}</span>
          ) : null}
        </div>
        <div className="gap-xs flex items-center">
          <Chip color={PRIORITY_CHIP_COLOR[schedule.priority]}>
            {PRIORITY_LABEL[schedule.priority]}
          </Chip>
        </div>
      </div>
    </div>
  );
}
