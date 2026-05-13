import { Button, Header, Scrollable, Title } from "@clab/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import { useAuthStore } from "@/model/common/store-auth";

import { libraryQueries } from "@/api/library/api.query";
import { ConfirmModal, EmptyState } from "@/components/common";
import { LoanBookCard } from "@/components/library";

export default function MyLibraryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const memberId = useAuthStore((s) => s.memberId);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);

  const { data: pendingLoans, isPending: isPendingLoansLoading } = useQuery({
    ...libraryQueries.getBooksLoanConditionsQuery({
      status: "PENDING",
      page: 0,
      size: 20,
      sortBy: "borrowedAt",
      sortDirection: "desc",
      borrowerId: memberId ?? undefined,
    }),
    enabled: memberId != null,
  });
  const { data: approvedLoans, isPending: isApprovedLoansLoading } = useQuery({
    ...libraryQueries.getBooksLoanConditionsQuery({
      status: "APPROVED",
      page: 0,
      size: 20,
      sortBy: "borrowedAt",
      sortDirection: "desc",
      borrowerId: memberId ?? undefined,
    }),
    enabled: memberId != null,
  });

  const deleteBookLoanRecordMutation = useMutation({
    ...libraryQueries.deleteBookLoanRecordMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryQueries.all });
    },
  });

  const myPendingLoans = pendingLoans?.items ?? [];
  const myApprovedLoans = approvedLoans?.items ?? [];

  const handleCancelLoan = (bookLoanRecordId: number) => {
    setCancelTarget(bookLoanRecordId);
  };

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>도서 대여 내역</Title>
          </button>
        }
        className="z-100 absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="pt-header-height pb-bottom-padding">
        <div className="px-gutter py-xl space-y-8">
          <section>
            <Title>대여 요청</Title>
            {isPendingLoansLoading ? (
              <EmptyState>대여 요청 내역을 불러오는 중...</EmptyState>
            ) : myPendingLoans.length > 0 ? (
              <div className="mt-lg flex flex-col">
                {myPendingLoans.map((loan) => (
                  <LoanBookCard
                    key={loan.bookLoanRecordId}
                    loan={loan}
                    action={
                      <Button
                        size="small"
                        color="active"
                        disabled={deleteBookLoanRecordMutation.isPending}
                        onClick={() => handleCancelLoan(loan.bookLoanRecordId)}
                      >
                        신청 취소
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState>대여 요청 중인 도서가 없습니다.</EmptyState>
            )}
          </section>

          <section>
            <Title>대여 중</Title>
            {isApprovedLoansLoading ? (
              <EmptyState>대여 중인 도서를 불러오는 중...</EmptyState>
            ) : myApprovedLoans.length > 0 ? (
              <div className="mt-lg flex flex-col">
                {myApprovedLoans.map((loan) => (
                  <LoanBookCard key={loan.bookLoanRecordId} loan={loan} />
                ))}
              </div>
            ) : (
              <EmptyState>대여 중인 도서가 없습니다.</EmptyState>
            )}
          </section>
        </div>
      </Scrollable>
      {cancelTarget !== null && (
        <ConfirmModal
          message="도서 대출 신청을 취소하시겠습니까?"
          onClose={() => setCancelTarget(null)}
          onConfirm={() => {
            if (cancelTarget !== null) {
              deleteBookLoanRecordMutation.mutate({
                bookLoanRecordId: cancelTarget,
              });
            }
            setCancelTarget(null);
          }}
        />
      )}
    </>
  );
}
