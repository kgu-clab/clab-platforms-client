import { Section } from "@clab/design-system";

import type { Activity, ActivityByStatus } from "@/api/activity/api.type";

import ActivityStudyItem from "./ActivityStudyItem";

interface ActivityStudyListProps {
  items: (Activity | ActivityByStatus)[];
  isPending: boolean;
  isError: boolean;
}

export default function ActivityStudyList({
  items,
  isPending,
  isError,
}: ActivityStudyListProps) {
  if (isPending) {
    return (
      <Section.List>
        <div className="text-14-regular text-gray-4 py-gutter text-center">
          로딩 중...
        </div>
      </Section.List>
    );
  }

  if (isError) {
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
