import { PlusButton, Section } from "@clab/design-system";
import { useNavigate } from "react-router";

import { ActivityStudyList } from "@/components/activity";

import { ROUTE } from "@/constants";

export default function ActivityStudyPage() {
  const navigate = useNavigate();

  const handleAddStudy = () => {
    navigate(ROUTE.ACTIVITY_CREATE);
  };
  return (
    <>
      <Section title="진행중인 스터디" className="px-gutter">
        <ActivityStudyList />
      </Section>
      <PlusButton onClick={handleAddStudy} />
    </>
  );
}
