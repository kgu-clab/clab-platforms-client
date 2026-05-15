import { Header, Scrollable, Section, Tabs, Title } from "@clab/design-system";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router";

import { useInfiniteScroll } from "@/model/common/useInfiniteScroll";

import { AdminListState, AdminTabBadge } from "@/components/admin";
import { SupportItem } from "@/components/support";

import { supportQueries } from "@/api/support";
import { ROUTE } from "@/constants";

type SupportTab = "PENDING" | "ALL";

export default function AdminSupportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get("tab") ?? "PENDING") as SupportTab;

  const pendingQuery = useInfiniteQuery(
    supportQueries.getSupportsInfiniteQuery({ status: "PENDING" }),
  );
  const allQuery = useInfiniteQuery({
    ...supportQueries.getSupportsInfiniteQuery(),
    enabled: tab === "ALL",
  });
  const activeQuery = tab === "PENDING" ? pendingQuery : allQuery;

  const { scrollRef, bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: activeQuery.hasNextPage ?? false,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
    fetchNextPage: activeQuery.fetchNextPage,
  });

  const pendingSupports = useMemo(
    () => pendingQuery.data?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [pendingQuery.data],
  );
  const allSupports = useMemo(
    () => allQuery.data?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [allQuery.data],
  );

  const visible = tab === "PENDING" ? pendingSupports : allSupports;
  const pendingCount = pendingQuery.data?.pages[0]?.data.totalItems ?? 0;
  const allCount = allQuery.data?.pages[0]?.data.totalItems ?? 0;

  return (
    <>
      <Header
        left={
          <button
            type="button"
            onClick={() => navigate(ROUTE.ADMIN)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>문의 관리</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <div ref={scrollRef} className="pt-header-height h-full overflow-y-auto">
        <Tabs>
          <Tabs.Item
            label="미답변"
            href={ROUTE.ADMIN_SUPPORT}
            endSlot={<AdminTabBadge count={pendingCount} />}
          />
          <Tabs.Item label="전체" href={`${ROUTE.ADMIN_SUPPORT}?tab=ALL`} />
        </Tabs>

        <Scrollable className="px-gutter py-xl">
          <Section
            title={
              tab === "PENDING"
                ? `미답변 ${pendingCount}건`
                : `전체 ${allCount}건`
            }
          >
            <AdminListState
              isPending={activeQuery.isPending}
              isError={activeQuery.isError}
              isEmpty={
                visible.length === 0 &&
                !activeQuery.isPending &&
                !activeQuery.isError
              }
              emptyMessage={
                tab === "PENDING"
                  ? "미답변 문의가 없습니다."
                  : "등록된 문의가 없습니다."
              }
            />

            {visible.length > 0 && (
              <Section.List>
                {visible.map((support) => (
                  <SupportItem
                    key={support.id}
                    support={support}
                    onSelect={(id) => navigate(ROUTE.ADMIN_SUPPORT_DETAIL(id))}
                  />
                ))}
              </Section.List>
            )}

            <div ref={bottomSentinelRef} />
          </Section>
        </Scrollable>
      </div>
    </>
  );
}
