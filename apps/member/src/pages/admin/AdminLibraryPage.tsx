import {
  Chip,
  Header,
  Scrollable,
  Section,
  Tabs,
  Title,
} from "@clab/design-system";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router";

import { useDebounce } from "@/model/common/useDebounce";
import { useInfiniteScroll } from "@/model/common/useInfiniteScroll";

import { AdminListState, AdminTabBadge } from "@/components/admin";
import { LibraryBookList, LibrarySearchBar } from "@/components/library";

import type { getBooksLoanConditionsResponse } from "@/api/library/api.model";
import { libraryQueries } from "@/api/library/api.query";
import { ROUTE } from "@/constants";

type LibraryTab = "LOANED" | "OVERDUE" | "BOOKS";

type LoanItem = getBooksLoanConditionsResponse["data"]["items"][number];

export default function AdminLibraryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get("tab") ?? "LOANED") as LibraryTab;
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const {
    data: loanedData,
    fetchNextPage: fetchNextLoanedPage,
    hasNextPage: hasNextLoanedPage,
    isFetchingNextPage: isFetchingNextLoanedPage,
    isPending: loanedPending,
    isError: loanedError,
  } = useInfiniteQuery(
    libraryQueries.getBooksLoanConditionsInfiniteQuery({
      status: "APPROVED",
      sortBy: "borrowedAt",
      sortDirection: "desc",
    }),
  );

  const allBookLoans = useMemo(
    () => loanedData?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [loanedData],
  );
  const loanedCount = loanedData?.pages[0]?.data.totalItems ?? 0;
  const overdueLoans = useMemo(
    () =>
      allBookLoans.filter(
        (item) => item.dueDate && dayjs(item.dueDate).isBefore(dayjs(), "day"),
      ),
    [allBookLoans],
  );

  const booksRequest = {
    title: debouncedKeyword.trim() || undefined,
  };

  const {
    data: booksData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending: booksPending,
    isError: booksError,
  } = useInfiniteQuery({
    ...libraryQueries.getBooksInfiniteQuery(booksRequest),
    enabled: tab === "BOOKS",
  });

  const { scrollRef, bottomSentinelRef } = useInfiniteScroll({
    hasNextPage:
      tab === "BOOKS" ? (hasNextPage ?? false) : (hasNextLoanedPage ?? false),
    isFetchingNextPage:
      tab === "BOOKS" ? isFetchingNextPage : isFetchingNextLoanedPage,
    fetchNextPage: tab === "BOOKS" ? fetchNextPage : fetchNextLoanedPage,
  });

  const books = useMemo(
    () => booksData?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [booksData],
  );

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
            <Title>도서 관리</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <div ref={scrollRef} className="pt-header-height h-full overflow-y-auto">
        <Tabs>
          <Tabs.Item
            label="대여"
            href={ROUTE.ADMIN_LIBRARY}
            endSlot={<AdminTabBadge count={loanedCount} />}
          />
          <Tabs.Item label="연체" href={`${ROUTE.ADMIN_LIBRARY}?tab=OVERDUE`} />
          <Tabs.Item
            label="도서"
            href={`${ROUTE.ADMIN_LIBRARY}?tab=BOOKS`}
            endSlot={
              <AdminTabBadge count={booksData?.pages[0]?.data.totalItems} />
            }
          />
        </Tabs>

        {tab === "LOANED" && (
          <Scrollable className="px-gutter py-xl">
            <Section title={`대여 중 ${loanedCount}권`}>
              <AdminListState
                isPending={loanedPending}
                isError={loanedError}
                isEmpty={!loanedPending && allBookLoans.length === 0}
                emptyMessage="대여 중인 도서가 없습니다."
              />
              <div className="gap-md flex flex-col">
                {allBookLoans.map((loan) => (
                  <LoanCard
                    key={loan.bookLoanRecordId}
                    loan={loan}
                    onClickBook={() =>
                      navigate(`${ROUTE.LIBRARY}/${loan.bookId}`)
                    }
                  />
                ))}
                <div ref={bottomSentinelRef} />
              </div>
            </Section>
          </Scrollable>
        )}

        {tab === "OVERDUE" && (
          <Scrollable className="px-gutter py-xl">
            <Section title={`확인된 연체 ${overdueLoans.length}건`}>
              {overdueLoans.length > 0 && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">
                  현재 불러온 대여 목록에서 {overdueLoans.length}권의 연체
                  도서를 확인했어요.
                </div>
              )}
              <AdminListState
                isPending={loanedPending}
                isError={loanedError}
                isEmpty={!loanedPending && overdueLoans.length === 0}
                emptyMessage="현재 불러온 목록에서 확인된 연체 도서가 없습니다."
              />
              <div className="gap-md flex flex-col">
                {overdueLoans.map((loan) => (
                  <LoanCard
                    key={loan.bookLoanRecordId}
                    loan={loan}
                    overdue
                    onClickBook={() =>
                      navigate(`${ROUTE.LIBRARY}/${loan.bookId}`)
                    }
                  />
                ))}
                <div ref={bottomSentinelRef} />
              </div>
            </Section>
          </Scrollable>
        )}

        {tab === "BOOKS" && (
          <Scrollable className="py-xl gap-lg">
            <LibrarySearchBar value={keyword} onChange={setKeyword} />
            <Section
              title={`전체 ${booksData?.pages[0]?.data.totalItems ?? 0}권`}
              className="px-gutter"
            >
              <AdminListState
                isPending={booksPending}
                isError={booksError}
                isEmpty={!booksPending && books.length === 0}
                emptyMessage="등록된 도서가 없습니다."
              />
              {books.length > 0 && (
                <LibraryBookList
                  books={books}
                  bottomSentinelRef={bottomSentinelRef}
                />
              )}
            </Section>
          </Scrollable>
        )}
      </div>
    </>
  );
}

interface LoanCardProps {
  loan: LoanItem;
  overdue?: boolean;
  onClickBook: () => void;
}

function LoanCard({ loan, overdue, onClickBook }: LoanCardProps) {
  const due = loan.dueDate ? dayjs(loan.dueDate) : null;
  const overdueDays = due ? dayjs().diff(due, "day") : 0;

  return (
    <div className="border-gray-2 gap-sm flex flex-col rounded-xl border bg-white p-4">
      <div className="gap-xs flex items-center">
        <Chip color={overdue ? "red" : "yellow"}>
          {overdue ? "연체" : "대여중"}
        </Chip>
        {due && (
          <span
            className={
              overdue
                ? "text-12-medium text-red-500"
                : "text-gray-4 text-12-regular"
            }
          >
            마감 {due.format("YYYY-MM-DD")}
            {overdue ? ` (${overdueDays}일 경과)` : ""}
          </span>
        )}
      </div>
      <button
        type="button"
        className="text-16-medium text-left text-black"
        onClick={onClickBook}
      >
        {loan.bookTitle}
      </button>
      <div className="text-12-regular text-gray-4">{loan.borrowerName}</div>
    </div>
  );
}
