import { Button, PlusButton, Section } from "@clab/design-system";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { ActivityStudyList } from "@/components/activity";

import type { ActivityCategory } from "@/api/activity/api.model";
import type { ActivityListFilter } from "@/api/activity/api.query";
import { ROUTE } from "@/constants";

const CATEGORY_OPTIONS: { value: ActivityCategory; label: string }[] = [
  { value: "STUDY", label: "스터디" },
  { value: "PROJECT", label: "프로젝트" },
];

const DEFAULT_FILTER: ActivityListFilter = {
  type: "category",
  category: "STUDY",
};

export default function ActivityStudyPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ActivityListFilter>(DEFAULT_FILTER);

  const handleAddStudy = () => {
    navigate(ROUTE.ACTIVITY_CREATE);
  };

  const categoryButtons = useMemo(
    () =>
      CATEGORY_OPTIONS.map(({ value, label }) => (
        <Button
          key={value}
          size="small"
          color={
            filter.type === "category" && filter.category === value
              ? "active"
              : "outlineActive"
          }
          onClick={() => setFilter({ type: "category", category: value })}
        >
          {label}
        </Button>
      )),
    [filter],
  );

  return (
    <>
      <Section title="진행중인 활동" className="px-gutter">
        <div className="space-y-md">
          <div className="gap-xs flex flex-wrap items-center">
            {categoryButtons}
          </div>
        </div>
        <ActivityStudyList filter={filter} />
      </Section>
      <PlusButton onClick={handleAddStudy} />
    </>
  );
}
