import {
  Button,
  Chip,
  Field,
  Header,
  Scrollable,
  Section,
  Title,
} from "@clab/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";

import { useAuthStore } from "@/model/common/store-auth";

import { libraryQueries } from "@/api/library/api.query";

const LOAN_CONDITIONS_PARAMS = {
  status: "PENDING" as const,
  page: 0,
  size: 20,
  sortBy: "borrowedAt" as const,
  sortDirection: "desc" as const,
};

export default function LibraryDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const memberId = useAuthStore((s) => s.memberId);
  const { id } = useParams<{ id: string }>();
  const bookId = id ? Number(id) : NaN;

  const {
    data: book,
    isPending,
    isError,
  } = useQuery({
    ...libraryQueries.getBooksDetailQuery({ id: bookId }),
    enabled: Number.isInteger(bookId) && bookId > 0,
  });

  const { data: loanConditions } = useQuery({
    ...libraryQueries.getBooksLoanConditionsQuery(LOAN_CONDITIONS_PARAMS),
    enabled: Number.isInteger(bookId) && bookId > 0 && !!book,
  });

  const hasApplied = useMemo(() => {
    if (!book || !loanConditions?.items.length) return false;
    const forThisBook = loanConditions.items.filter(
      (item) => item.bookId === book.id,
    );
    if (forThisBook.length === 0) return false;
    return memberId != null && forThisBook[0].borrowerId === memberId;
  }, [book, loanConditions, memberId]);

  const postBookLoanMutation = useMutation({
    ...libraryQueries.postBookLoanMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryQueries.all });
    },
  });

  const isAvailable = book ? !book.borrowerId : false;

  const isButtonDisabled =
    !isAvailable || hasApplied || postBookLoanMutation.isPending;

  const handleLoanApply = () => {
    if (!book || !isAvailable || hasApplied) return;
    postBookLoanMutation.mutate(
      { bookId: book.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: libraryQueries.loanConditionsKey(LOAN_CONDITIONS_PARAMS),
          });
        },
      },
    );
  };

  const formatDate = (dateString: string) => {
    return dateString.split("T")[0];
  };

  if (isPending || (!book && !isError)) {
    return (
      <Scrollable>
        <Header
          left={
            <button type="button" onClick={() => navigate(-1)}>
              <GoChevronLeft size={24} />
            </button>
          }
          className="z-100 absolute left-0 right-0 top-0 bg-transparent"
        />
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-4 text-14-regular">로딩 중...</p>
        </div>
      </Scrollable>
    );
  }

  if (isError || !book) {
    return (
      <Scrollable>
        <Header
          left={
            <button type="button" onClick={() => navigate(-1)}>
              <GoChevronLeft size={24} />
            </button>
          }
          className="z-100 absolute left-0 right-0 top-0 bg-transparent"
        />
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-5 text-14-regular">
            도서 정보를 불러올 수 없습니다.
          </p>
        </div>
      </Scrollable>
    );
  }

  return (
    <>
      <Scrollable>
        <Header
          left={
            <button type="button" onClick={() => navigate(-1)}>
              <GoChevronLeft size={24} />
            </button>
          }
          className="z-100 absolute left-0 right-0 top-0 bg-transparent"
        />

        <div className="absolute left-0 right-0 top-0 h-[50vh] w-full bg-gray-200">
          <div className="relative flex items-end justify-center overflow-hidden px-6 pb-12 pt-16">
            {book.imageUrl && book.imageUrl !== "없음" && (
              <img
                src={book.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full scale-125 object-cover blur-sm brightness-75"
              />
            )}

            <div className="z-10 flex items-stretch justify-center gap-2">
              <div className="aspect-3/4 w-40 shadow-lg">
                {book.imageUrl && book.imageUrl !== "없음" ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-2 flex h-full w-full items-center justify-center">
                    <span className="text-gray-4 text-12-regular">
                      이미지 없음
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-2">
                {book.reviewLinks.length > 0 ? (
                  book.reviewLinks.map((url, index) => (
                    <a
                      key={url + index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-gray-2 gap-sm flex flex-1 flex-col items-center justify-center bg-white px-4 py-3 shadow-lg"
                    >
                      <span className="text-lg">🔗</span>
                      <span className="text-12-medium text-gray-5">
                        리뷰 링크 {index + 1}
                      </span>
                    </a>
                  ))
                ) : (
                  <>
                    <button
                      type="button"
                      className="border-gray-2 gap-sm flex flex-1 flex-col items-center justify-center bg-white px-4 py-3 shadow-lg"
                    >
                      <span className="text-lg">💚</span>
                      <span className="text-12-medium text-gray-5">
                        교보문고
                      </span>
                    </button>
                    <button
                      type="button"
                      className="border-gray-2 gap-sm flex flex-1 flex-col items-center justify-center bg-white px-4 py-3 shadow-lg"
                    >
                      <span className="text-lg">💚</span>
                      <span className="text-12-medium text-gray-5">Yes24</span>
                    </button>
                    <button
                      type="button"
                      className="border-gray-2 gap-sm flex flex-1 flex-col items-center justify-center bg-white px-4 py-3 shadow-lg"
                    >
                      <span className="text-lg">💜</span>
                      <span className="text-12-medium text-gray-5">알라딘</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-gutter rounded-t-bottom-navbar pb-bottom-padding gap-3xl relative z-50 mt-[36vh] flex h-full flex-col bg-white pt-8">
          <Title>{book.title}</Title>

          <div className="space-y-xs">
            <Field title="작가" description={book.author} />
            <Field title="출판사" description={book.publisher} />
            <Field title="등록일" description={formatDate(book.createdAt)} />
            <Field title="변경일" description={formatDate(book.updatedAt)} />
          </div>

          <div className="gap-xs flex items-center">
            <Chip color="purple">{book.category}</Chip>
            <Chip color={isAvailable ? "green" : "yellow"}>
              {isAvailable ? "대여가능" : "대여중"}
            </Chip>
          </div>

          <Section title="대여 내역">
            {book.borrowerName ? (
              <p className="text-14-regular text-gray-5">
                {book.borrowerName}님이 대여 중 (반납 예정일: {book.dueDate})
              </p>
            ) : (
              <p className="text-14-regular text-gray-4">
                대여 내역이 없습니다.
              </p>
            )}
          </Section>

          <footer className="z-999 h-bottom-navbar-height px-gutter border-gray-2 fixed bottom-0 left-0 right-0 box-border flex items-center justify-center border-t bg-white">
            <Button disabled={isButtonDisabled} onClick={handleLoanApply}>
              {hasApplied
                ? "신청 완료"
                : postBookLoanMutation.isPending
                  ? "처리 중..."
                  : "대출 신청"}
            </Button>
          </footer>
        </div>
      </Scrollable>
    </>
  );
}
