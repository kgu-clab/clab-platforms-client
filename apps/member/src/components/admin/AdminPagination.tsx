import { Button } from "@clab/design-system";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="gap-sm mt-lg flex items-center justify-center">
      <Button
        size="small"
        color="outlineActive"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage <= 0}
      >
        이전
      </Button>
      <span className="text-12-medium text-gray-5 px-2">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        size="small"
        color="outlineActive"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
      >
        다음
      </Button>
    </div>
  );
}
