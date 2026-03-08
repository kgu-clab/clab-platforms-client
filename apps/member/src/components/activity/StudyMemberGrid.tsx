import { Chip } from "@clab/design-system";

import { ProfileImage } from "@/components/common";

import type { ActivityGroupMember } from "@/api/activity/api.type";

function formatGeneration(memberId: string): string {
  const gen = memberId.slice(2, 4);
  return gen ? `(${gen})` : "";
}

interface StudyMemberGridProps {
  groupMembers?: ActivityGroupMember[] | readonly ActivityGroupMember[];
}

export default function StudyMemberGrid({
  groupMembers = [],
}: StudyMemberGridProps) {
  const members = Array.isArray(groupMembers) ? [...groupMembers] : [];

  return (
    <div className="scrollbar-hide -mx-gutter px-gutter overflow-x-auto">
      {members.length === 0 ? (
        <p className="text-13-regular text-gray-4">참여 인원이 없습니다.</p>
      ) : (
        <div className="gap-xl flex">
          {members.map((member) => (
            <div
              key={member.memberId}
              className="gap-sm flex shrink-0 flex-col items-center justify-center"
            >
              <ProfileImage size="size-[50px]" />
              <Chip color="yellow">{member.role || "멤버"}</Chip>
              <p className="text-13-regular">
                {member.memberName}
                {formatGeneration(member.memberId)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
