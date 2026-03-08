import { Button, Header, Section, Title } from "@clab/design-system";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useLocation, useNavigate } from "react-router";

import { useInfiniteScroll } from "@/model/common/useInfiniteScroll";

import {
  FAQAccordion,
  MySupportsCard,
  SupportItem,
} from "@/components/support";

import { supportQueries } from "@/api/support";
import { ROUTE } from "@/constants";
import { FAQ_DATA, type FaqCategory } from "@/constants/faq";

interface SupportPageState {
  showAllSupports?: boolean;
}

export default function SupportPage() {
  const [selectedTab, setSelectedTab] = useState<FaqCategory>("MEMBERS");
  const location = useLocation();
  const navigate = useNavigate();
  const returnState = location.state as SupportPageState | null;

  const [showAllSupports, setShowAllSupports] = useState(
    returnState?.showAllSupports ?? false,
  );

  const {
    data: allData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...supportQueries.getSupportsInfiniteQuery(),
    enabled: showAllSupports,
  });

  const { scrollRef, bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allSupports = allData?.pages.flatMap((p) => p.data.items) ?? [];
  const filteredFAQ = FAQ_DATA.filter((faq) => faq.category === selectedTab);

  const handleShowAll = () => {
    setShowAllSupports(true);
  };

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(ROUTE.MY)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>문의</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <div
        ref={scrollRef}
        className="pt-header-height px-gutter scrollbar-hide h-full overflow-y-auto"
      >
        <Section
          title="내 문의 & 신고"
          className="py-xl border-b border-b-gray-100 bg-white"
        >
          <MySupportsCard />
        </Section>

        <Section className="py-xl" title="문의가 있으신가요?">
          <p className="text-14-regular text-gray-4 my-xs">
            동아리원들이 많이 물어보는 질문들이에요.
          </p>
          <div className="gap-sm flex">
            <Button
              size="small"
              onClick={() => setSelectedTab("MEMBERS")}
              color={selectedTab === "MEMBERS" ? "outlineActive" : "disabled"}
              key="faq-tab-MEMBERS"
            >
              맴버스
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedTab("CLUB")}
              color={selectedTab === "CLUB" ? "outlineActive" : "disabled"}
              key="faq-tab-CLUB"
            >
              동아리
            </Button>
          </div>
          {filteredFAQ.map((faq) => (
            <FAQAccordion key={faq.id} faq={faq} />
          ))}
        </Section>

        <div className="px-gutter -mx-gutter sticky top-0 z-10 border-b border-b-gray-100 bg-white py-3">
          <Section className="py-md">
            <p className="text-14-regular text-gray-4 mb-md flex justify-center">
              FAQ, 전체 문의로 문제를 해결하지 못하셨나요?
            </p>
            <Button
              size="large"
              onClick={() => {
                navigate(ROUTE.SUPPORT, { replace: true, state: null });
                navigate(ROUTE.SUPPORT_WRITE);
              }}
            >
              문의 작성하기
            </Button>
            {!showAllSupports && (
              <Button
                size="large"
                color="outlineActive"
                onClick={handleShowAll}
              >
                전체 문의 보기
              </Button>
            )}
          </Section>
        </div>

        {showAllSupports && (
          <Section title="전체 문의" className="py-3xl">
            {allSupports.length > 0 ? (
              <>
                <Section.List>
                  {allSupports.map((support) => (
                    <SupportItem
                      key={support.id}
                      support={support}
                      onSelect={(id) => navigate(`/support/${id}`)}
                    />
                  ))}
                </Section.List>
                <div ref={bottomSentinelRef} />
              </>
            ) : (
              <p className="text-13-regular text-gray-4 py-4">
                등록된 문의가 없습니다.
              </p>
            )}
          </Section>
        )}
      </div>
    </>
  );
}
