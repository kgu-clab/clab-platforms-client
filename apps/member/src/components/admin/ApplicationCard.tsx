import { Button, Chip } from "@clab/design-system";
import { useState } from "react";

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="border-gray-2 gap-sm flex flex-col rounded-xl border bg-white p-4">
      <div className="gap-xs flex flex-wrap items-center">
        <Chip color={application.isPass ? "green" : "red"}>
          {application.isPass ? "합격" : "불합격"}
        </Chip>
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
      <div className="text-12-regular text-gray-4 gap-xs flex flex-col">
        <p>연락처 {application.contact}</p>
        <p>{application.email}</p>
        {application.githubUrl && (
          <a
            href={application.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary w-fit underline underline-offset-2"
          >
            GitHub 프로필 보기
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsDetailsOpen((isOpen) => !isOpen)}
        className="text-12-medium text-primary w-fit"
      >
        {isDetailsOpen ? "지원서 정보 접기" : "지원서 정보 더 보기"}
      </button>
      {isDetailsOpen && (
        <dl className="border-gray-2 text-12-regular gap-sm grid grid-cols-[5rem_1fr] rounded-lg border p-3 text-black">
          <dt className="text-gray-4">생년월일</dt>
          <dd>{application.birth || "-"}</dd>
          <dt className="text-gray-4">주소</dt>
          <dd>{application.address || "-"}</dd>
          <dt className="text-gray-4">관심 분야</dt>
          <dd className="whitespace-pre-wrap">
            {application.interests || "-"}
          </dd>
          <dt className="text-gray-4">기타 활동</dt>
          <dd className="whitespace-pre-wrap">
            {application.otherActivities || "-"}
          </dd>
        </dl>
      )}
      <div className="gap-sm flex justify-end">
        <Button
          size="small"
          color="outlineActive"
          onClick={onReject}
          disabled={isMutating}
        >
          불합격
        </Button>
        <Button size="small" onClick={onApprove} disabled={isMutating}>
          합격
        </Button>
      </div>
    </div>
  );
}
