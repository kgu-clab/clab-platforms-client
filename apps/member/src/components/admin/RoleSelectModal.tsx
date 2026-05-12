import { Modal } from "@clab/design-system";

import type {
  MemberResponseDto,
  MemberRole,
  MemberRoleInfoResponseDto,
} from "@/api/member";

type AdminMemberItem = MemberResponseDto | MemberRoleInfoResponseDto;

const MEMBER_ROLES = ["GUEST", "USER", "ADMIN", "SUPER"] as const;

interface RoleSelectModalProps {
  member: AdminMemberItem;
  onClose: () => void;
  onSelect: (role: MemberRole) => void;
}

export default function RoleSelectModal({
  member,
  onClose,
  onSelect,
}: RoleSelectModalProps) {
  return (
    <Modal isOpen onClose={onClose} title="권한 변경">
      <div className="gap-lg flex flex-col">
        <p className="text-14-regular text-black">
          {member.name} 회원의 역할을 선택하세요.
        </p>
        <div className="gap-sm flex flex-col">
          {MEMBER_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              className="border-gray-2 flex items-center justify-between rounded-xl border px-4 py-3 text-left"
              onClick={() => onSelect(role)}
            >
              <span className="text-14-medium text-black">{role}</span>
              <span
                className={
                  member.role === role
                    ? "border-primary bg-primary h-4 w-4 rounded-full border"
                    : "border-gray-3 h-4 w-4 rounded-full border"
                }
              />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
