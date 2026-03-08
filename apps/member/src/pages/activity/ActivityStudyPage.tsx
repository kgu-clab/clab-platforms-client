import { Button, PlusButton, Section } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { ActivityStudyList } from "@/components/activity";

import type { ActivityCategory } from "@/api/activity/api.model";
import { activityQueries } from "@/api/activity/api.query";
import type { Activity } from "@/api/activity/api.type";
import { DEFAULT_PAGE_SIZE } from "@/api/config";
import { ROUTE } from "@/constants";

const PAGE = 0;

const CATEGORY_OPTIONS: { value: ActivityCategory; label: string }[] = [
  { value: "STUDY", label: "스터디" },
  { value: "PROJECT", label: "프로젝트" },
];

export default function ActivityStudyPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ActivityCategory>("STUDY");

  const categoryQuery = useQuery({
    ...activityQueries.getActivityByCategoryQuery({
      category,
      page: PAGE,
      size: DEFAULT_PAGE_SIZE,
    }),
  });

  const items: Activity[] = categoryQuery.data?.items ?? [];

  const handleAddStudy = () => {
    navigate(ROUTE.ACTIVITY_CREATE);
  };

  const categoryButtons = useMemo(
    () =>
      CATEGORY_OPTIONS.map(({ value, label }) => (
        <Button
          key={value}
          size="small"
          color={category === value ? "active" : "outlineActive"}
          onClick={() => setCategory(value)}
        >
          {label}
        </Button>
      )),
    [category],
  );

  return (
    <>
      <Section title="진행중인 활동" className="px-gutter">
        <div className="space-y-md">
          <div className="gap-xs flex flex-wrap items-center">
            {categoryButtons}
          </div>
        </div>
        <ActivityStudyList
          items={items}
          isPending={categoryQuery.isPending}
          isError={categoryQuery.isError}
        />
      </Section>
      <PlusButton onClick={handleAddStudy} />
    </>
  );
}
