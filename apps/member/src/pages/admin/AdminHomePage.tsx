import { Header, Scrollable, Section, Title } from "@clab/design-system";
import { useQueries, useQuery } from "@tanstack/react-query";
import { BiCommentError } from "react-icons/bi";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";
import { ImBubbles } from "react-icons/im";
import { IoBook, IoPerson } from "react-icons/io5";

import { AdminMenuCard } from "@/components/admin";
import { BottomNavbar } from "@/components/menu";

import { activityQueries } from "@/api/activity/api.query";
import { accusationQueries } from "@/api/community/accusation";
import { libraryQueries } from "@/api/library/api.query";
import { supportQueries } from "@/api/support";
import { ROUTE } from "@/constants";

const PENDING_LOAN_PARAMS = {
  status: "PENDING" as const,
  page: 0,
  size: 1,
  sortBy: "borrowedAt" as const,
  sortDirection: "desc" as const,
};

export default function AdminHomePage() {
  const { data: pendingSupportPage } = useQuery(
    supportQueries.getSupportsQuery({
      status: "PENDING",
      page: 0,
      size: 1,
    }),
  );
  const pendingSupportCount = pendingSupportPage?.totalItems ?? 0;

  const [waitingActivityRes, progressingActivityRes] = useQueries({
    queries: ["WAITING", "PROGRESSING"].map((status) =>
      activityQueries.getActivityByStatusQuery({
        activityGroupStatus: status as "WAITING" | "PROGRESSING",
        page: 0,
        size: 1,
      }),
    ),
  });
  const waitingActivityCount = waitingActivityRes.data?.totalItems ?? 0;
  const progressingActivityCount = progressingActivityRes.data?.totalItems ?? 0;

  const { data: pendingLoans } = useQuery(
    libraryQueries.getBooksLoanConditionsQuery(PENDING_LOAN_PARAMS),
  );
  const { data: approvedLoans } = useQuery(
    libraryQueries.getBooksLoanConditionsQuery({
      ...PENDING_LOAN_PARAMS,
      status: "APPROVED",
    }),
  );
  const pendingLoanCount = pendingLoans?.totalItems ?? 0;
  const loanedCount = approvedLoans?.totalItems ?? 0;

  const { data: accusationsRes } = useQuery(
    accusationQueries.getAccusationsQuery({
      page: 0,
      size: 1,
      accuseStatus: "PENDING",
    }),
  );
  const pendingAccusationCount =
    accusationsRes?.ok && accusationsRes.data.data
      ? accusationsRes.data.data.totalItems
      : 0;

  const totalPending =
    pendingSupportCount +
    waitingActivityCount +
    pendingLoanCount +
    pendingAccusationCount;

  return (
    <>
      <Header
        left={<Title>관리</Title>}
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <Scrollable className="pt-header-height pb-bottom-padding px-gutter gap-xl">
        <Section className="py-xl">
          <div className="bg-primary/5 border-primary/20 gap-md flex flex-col rounded-2xl border p-5">
            <span className="text-14-medium text-primary">
              {totalPending > 0
                ? `${totalPending}건의 처리 대기 항목이 있어요`
                : "처리 대기 항목이 없습니다"}
            </span>
            <div className="gap-sm flex flex-wrap">
              <SummaryChip label="문의 미답변" count={pendingSupportCount} />
              <SummaryChip label="활동 신청" count={waitingActivityCount} />
              <SummaryChip label="대출 신청" count={pendingLoanCount} />
              <SummaryChip label="신고" count={pendingAccusationCount} />
            </div>
          </div>
        </Section>

        <Section title="관리 메뉴" className="pb-xl">
          <div className="gap-md flex flex-col">
            <AdminMenuCard
              to={ROUTE.ADMIN_MEMBER}
              label="회원 관리"
              description="가입 신청 · 권한"
              icon={IoPerson}
            />
            <AdminMenuCard
              to={ROUTE.ADMIN_LIBRARY}
              label="도서 관리"
              description={`대여 중 ${loanedCount} · 대출 신청 ${pendingLoanCount}`}
              icon={IoBook}
            />
            <AdminMenuCard
              to={ROUTE.ADMIN_ACTIVITY}
              label="활동 관리"
              description={`진행 ${progressingActivityCount} · 신청 ${waitingActivityCount}`}
              icon={HiMiniSquare3Stack3D}
            />
            <AdminMenuCard
              to={ROUTE.ADMIN_REPORT}
              label="신고 관리"
              description={`신고 ${pendingAccusationCount}건`}
              icon={ImBubbles}
            />
            <AdminMenuCard
              to={ROUTE.ADMIN_SUPPORT}
              label="문의 관리"
              description={`미답변 ${pendingSupportCount}건`}
              icon={BiCommentError}
            />
          </div>
        </Section>
      </Scrollable>

      <BottomNavbar />
    </>
  );
}

function SummaryChip({ label, count }: { label: string; count: number }) {
  return (
    <div className="gap-xs flex items-center rounded-full border border-gray-100 bg-white px-3 py-1.5">
      <span className="text-12-regular text-gray-5">{label}</span>
      <span className="text-12-medium text-primary">{count}</span>
    </div>
  );
}
