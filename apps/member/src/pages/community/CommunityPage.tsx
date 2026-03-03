import { PlusButton, Section } from "@clab/design-system";
import { useNavigate, useSearchParams } from "react-router";

import { CATEGORY, TAB_TO_BOARD_CATEGORY } from "@/api/community";
import type { CategoryTab } from "@/api/community";

import {
  BoardPostList,
  QuestionPostList,
  InformationPostList,
  CommunityFilter,
} from "@/components/community";

import { ROUTE } from "@/constants";

export default function CommunityPage() {
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get("tab") ?? CATEGORY.NOTICE) as CategoryTab;
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate(ROUTE.COMMUNITY_WRITE);
  };

  return (
    <>
      <Section>
        <CommunityFilter tab={tab} />
        <CommunityTabContent tab={tab} />
        <PlusButton onClick={handleWriteClick} />
      </Section>
    </>
  );
}

function CommunityTabContent({ tab }: { tab: CategoryTab }) {
  switch (tab) {
    case CATEGORY.QUESTION:
      return <QuestionPostList />;
    case CATEGORY.INFORMATION:
      return <InformationPostList />;
    default:
      return <BoardPostList category={TAB_TO_BOARD_CATEGORY[tab]} />;
  }
}
