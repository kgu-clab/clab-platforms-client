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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery(supportQueries.getSupportsInfiniteQuery());

  const { scrollRef, bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allSupports = useMemo(
    () => data?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [data],
  );
  const pendingSupports = useMemo(
    () => allSupports.filter((s) => s.status === "PENDING"),
    [allSupports],
  );

  const visible = tab === "PENDING" ? pendingSupports : allSupports;

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
            endSlot={<AdminTabBadge count={pendingSupports.length} />}
          />
          <Tabs.Item label="전체" href={`${ROUTE.ADMIN_SUPPORT}?tab=ALL`} />
        </Tabs>

        <Scrollable className="px-gutter py-xl">
          <Section
            title={
              tab === "PENDING"
                ? `미답변 ${pendingSupports.length}건`
                : `전체 ${allSupports.length}건`
            }
          >
            <AdminListState
              isPending={isPending}
              isError={isError}
              isEmpty={visible.length === 0 && !isPending && !isError}
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
