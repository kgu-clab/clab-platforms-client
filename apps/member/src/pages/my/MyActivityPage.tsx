import { Header, Scrollable, Section, Title } from "@clab/design-system";
import { useQueries } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import { ActivityStudyItem } from "@/components/activity";

import { activityQueries } from "@/api/activity/api.query";
import type { ActivityByStatus } from "@/api/activity/api.type";
import { DEFAULT_PAGE_SIZE } from "@/api/config";

const JOINED_STATUSES = ["WAITING", "PROGRESSING", "END"] as const;

export default function MyActivityPage() {
  const navigate = useNavigate();

  const results = useQueries({
    queries: JOINED_STATUSES.map((status) =>
      activityQueries.getActivityJoinedQuery({
        status,
        page: 0,
        size: DEFAULT_PAGE_SIZE,
      }),
    ),
  });

  const activities = useMemo(() => {
    const items = results.flatMap((r) => r.data?.items ?? []);
    return items.sort((a, b) =>
      dayjs(b.createdAt).diff(dayjs(a.createdAt)),
    ) as ActivityByStatus[];
  }, [results]);

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>내 활동</Title>
          </button>
        }
        className="z-100 absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="pt-header-height pb-bottom-padding">
        <Section className="px-gutter py-xl">
          {isLoading ? (
            <p className="text-13-regular text-gray-4">불러오는 중...</p>
          ) : isError ? (
            <p className="text-13-regular text-gray-4">
              활동 목록을 불러오지 못했습니다.
            </p>
          ) : activities.length === 0 ? (
            <p className="text-13-regular text-gray-4">
              참여 중인 활동이 없습니다.
            </p>
          ) : (
            <Section.List>
              {activities.map((activity) => (
                <ActivityStudyItem key={activity.id} activity={activity} />
              ))}
            </Section.List>
          )}
        </Section>
      </Scrollable>
    </>
  );
}
