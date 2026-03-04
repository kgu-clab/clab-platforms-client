import { Chip } from "@clab/design-system";

import { ProfileImage } from "@/components/common";

export default function StudyMemberGrid() {
  return (
    <div className="gap-xs grid grid-cols-4">
      <MemberItem />
      <MemberItem />
      <MemberItem />
      <MemberItem />
      <MemberItem />
      <MemberItem />
    </div>
  );
}

function MemberItem() {
  return (
    <div className="gap-sm flex flex-col items-center justify-center">
      <ProfileImage size="size-[50px]" showRing={false} />
      <Chip color="yellow">리더</Chip>
      <p className="text-13-regular">장영후(23)</p>
    </div>
  );
}
