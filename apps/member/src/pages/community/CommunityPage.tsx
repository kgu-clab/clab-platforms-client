import { PlusButton, Section } from "@clab/design-system";
import { useNavigate, useSearchParams } from "react-router";

import { CATEGORY } from "@/types/community";

import { CommunityPostList, CommunityFilter } from "@/components/community";

import { ROUTE } from "@/constants";

export default function CommunityPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate(ROUTE.COMMUNITY_WRITE);
  };

  return (
    <>
      <Section>
        <CommunityFilter tab={tab ?? CATEGORY.NOTICE} />
        <CommunityPostList />
        <PlusButton onClick={handleWriteClick} />
      </Section>
    </>
  );
}
