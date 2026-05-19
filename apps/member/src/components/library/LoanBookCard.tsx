import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import type { BookLoanCondition } from "@/api/library/api.type";
import { ROUTE } from "@/constants";

interface LoanBookCardProps {
  loan: BookLoanCondition;
  action?: ReactNode;
}

export default function LoanBookCard({ loan, action }: LoanBookCardProps) {
  const navigate = useNavigate();

  return (
    <div className="border-gray-1 flex items-center gap-4 border-b py-3">
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
        role="button"
        tabIndex={0}
        onClick={() => navigate(`${ROUTE.LIBRARY}/${loan.bookId}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`${ROUTE.LIBRARY}/${loan.bookId}`);
          }
        }}
      >
        <div className="bg-gray-1 h-20 w-16 flex-shrink-0 overflow-hidden rounded">
          {loan.bookImageUrl && loan.bookImageUrl !== "없음" ? (
            <img
              src={loan.bookImageUrl}
              alt={loan.bookTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-gray-3 text-12-regular text-center">
                이미지 없음
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-14-medium line-clamp-2 text-black">
            {loan.bookTitle}
          </h3>
          <p className="text-12-regular text-gray-4 mt-1">
            신청일: {loan.borrowedAt?.split("T")[0] ?? "-"}
            {loan.dueDate && (
              <>
                <br />
                반납 예정일: {loan.dueDate?.split("T")[0] ?? "-"}
              </>
            )}
          </p>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
