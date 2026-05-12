import { Button, Chip } from "@clab/design-system";

import type {
  MemberResponseDto,
  MemberRoleInfoResponseDto,
} from "@/api/member";
import { formatDate } from "@/utils/date";
import { formatStudentStatus, getRoleColor } from "@/utils/member";

type AdminMemberItem = MemberResponseDto | MemberRoleInfoResponseDto;

interface MemberCardProps {
  member: AdminMemberItem;
  isMutating: boolean;
  onChangeRole: () => void;
  onPasswordResend: () => void;
  onDelete: () => void;
}

export default function MemberCard({
  member,
  isMutating,
  onChangeRole,
  onPasswordResend,
  onDelete,
}: MemberCardProps) {
  return (
    <div
      className="border-gray-2 gap-sm flex flex-col rounded-xl border bg-white p-4"
      onDoubleClick={onPasswordResend}
    >
      <div className="gap-xs flex flex-wrap items-center">
        <Chip color={getRoleColor(member.role)}>{member.role}</Chip>
        <span className="text-12-regular text-gray-4 ml-auto">
          가입 {member.createdAt ? formatDate(member.createdAt) : "-"}
        </span>
      </div>
      <div className="gap-xs flex flex-col">
        <p className="text-16-medium text-black">{member.name}</p>
        <p className="text-12-regular text-gray-4">
          학번 : {member.id} / 학적 :{" "}
          {formatStudentStatus(member.studentStatus)}
        </p>
        {member.department && (
          <p className="text-12-regular text-gray-4">
            {member.department}
            {typeof member.grade === "number" ? ` · ${member.grade}학년` : ""}
          </p>
        )}
      </div>
      <div className="gap-sm flex flex-wrap justify-end">
        <Button
          size="small"
          color="outlineActive"
          onClick={onChangeRole}
          disabled={isMutating}
        >
          권한 변경
        </Button>
        <Button
          size="small"
          color="outlineActive"
          onClick={onPasswordResend}
          disabled={isMutating}
        >
          비밀번호 재전송
        </Button>
        <Button
          size="small"
          color="outlineActive"
          onClick={onDelete}
          disabled={isMutating}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
