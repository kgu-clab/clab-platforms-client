import { Section } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";

import {
  activityQueries,
  type ActivityListFilter,
} from "@/api/activity/api.query";
import type { Activity, ActivityByStatus } from "@/api/activity/api.type";
import { DEFAULT_PAGE_SIZE } from "@/api/config";

import ActivityStudyItem from "./ActivityStudyItem";

export type { ActivityListFilter };

const PAGE = 0;

interface ActivityStudyListProps {
  filter: ActivityListFilter;
}

export default function ActivityStudyList({ filter }: ActivityStudyListProps) {
  const isByCategory = filter.type === "category";
  const categoryQuery = useQuery({
    ...activityQueries.getActivityByCategoryQuery({
      category: filter.type === "category" ? filter.category : "STUDY",
      page: PAGE,
      size: DEFAULT_PAGE_SIZE,
    }),
    enabled: isByCategory,
  });
  const statusQuery = useQuery({
    ...activityQueries.getActivityByStatusQuery({
      status: filter.type === "status" ? filter.status : "PROGRESSING",
      page: PAGE,
      size: DEFAULT_PAGE_SIZE,
    }),
    enabled: !isByCategory,
  });

  const query = isByCategory ? categoryQuery : statusQuery;
  const items: (Activity | ActivityByStatus)[] = query.data?.items ?? [];

  if (query.isPending) {
    return (
      <Section.List>
        <div className="text-14-regular text-gray-4 py-gutter text-center">
          로딩 중...
        </div>
      </Section.List>
    );
  }

  if (query.isError) {
    return (
      <Section.List>
        <div className="text-14-regular text-red-5 py-gutter text-center">
          목록을 불러오지 못했습니다.
        </div>
      </Section.List>
    );
  }

  return (
    <Section.List>
      {items.length === 0 ? (
        <div className="text-14-regular text-gray-4 py-gutter text-center">
          활동이 없습니다.
        </div>
      ) : (
        items.map((activity) => (
          <ActivityStudyItem key={activity.id} activity={activity} />
        ))
      )}
    </Section.List>
  );
}
