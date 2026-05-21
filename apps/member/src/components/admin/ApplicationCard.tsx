import { Button, Chip } from "@clab/design-system";

import type { ApplicationResponseDto } from "@/api/application";
import { formatRelativeTime } from "@/utils/date";

interface ApplicationCardProps {
  application: ApplicationResponseDto;
  isMutating: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export default function ApplicationCard({
  application,
  isMutating,
  onApprove,
  onReject,
}: ApplicationCardProps) {
  return (
    <div className="border-gray-2 gap-sm flex flex-col rounded-xl border bg-white p-4">
      <div className="gap-xs flex flex-wrap items-center">
        <Chip color="yellow">신청</Chip>
        <span className="text-12-regular text-gray-4 ml-auto">
          {formatRelativeTime(application.createdAt)}
        </span>
      </div>
      <div className="gap-xs flex flex-col">
        <p className="text-16-medium text-black">{application.name}</p>
        <p className="text-12-regular text-gray-4">
          학번 {application.studentId} · {application.department}
        </p>
        <p className="text-12-regular text-gray-4">
          학적 {application.studentStatus ?? "-"} · {application.grade}학년
        </p>
      </div>
      <div className="gap-sm flex justify-end">
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
      </div>
    </div>
  );
}
