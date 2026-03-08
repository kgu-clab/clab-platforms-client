import { Button, Chip, Dropdown, Section } from "@clab/design-system";
import { IoChevronDown } from "react-icons/io5";

import { ProfileImage } from "@/components/common";

import type { ActivityGroupMember } from "@/api/activity/api.type";
import { getRoleLabel, getRoleOptions } from "@/utils/role";

function formatGeneration(memberId: string): string {
  const gen = memberId.slice(2, 4);
  return gen ? `(${gen})` : "";
}

interface ActivityManageMemberListProps {
  members: ActivityGroupMember[];
  onRoleChange: (member: ActivityGroupMember, newRole: string) => void;
}

export default function ActivityManageMemberList({
  members,
  onRoleChange,
}: ActivityManageMemberListProps) {
  return (
    <Section
      title={
        <>
          활동 멤버
          <span className="text-13-regular ml-sm text-gray-5 font-normal">
            총 {members.length}명
          </span>
        </>
      }
      className="px-gutter"
    >
      <Section.List>
        {members.length === 0 ? (
          <p className="text-13-regular text-gray-4">
            참여 중인 멤버가 없습니다.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.memberId}
              className="border-gray-2 gap-md py-lg flex items-center justify-between border-b last:border-b-0"
            >
              <div className="gap-md flex items-center">
                <ProfileImage size="size-[40px]" />
                <div>
                  <p className="text-14-medium text-black">
                    {member.memberName}
                    {formatGeneration(member.memberId)}
                  </p>
                </div>
              </div>
              <div className="gap-md flex items-center">
                <Chip
                  color={member.role === "LEADER" ? "yellow" : "primary"}
                  className="mt-xs"
                >
                  {getRoleLabel(member.role)}
                </Chip>
                <Dropdown
                  trigger={
                    <Button
                      size="small"
                      color="ghost"
                      className="gap-xs flex items-center"
                    >
                      직책 변경
                      <IoChevronDown size={16} />
                    </Button>
                  }
                  align="end"
                >
                  {getRoleOptions().map((opt) => (
                    <Dropdown.Item
                      key={opt.value}
                      onSelect={() => onRoleChange(member, opt.value)}
                    >
                      {opt.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
            </div>
          ))
        )}
      </Section.List>
    </Section>
  );
}
