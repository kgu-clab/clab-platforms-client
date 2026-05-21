interface AdminListStateProps {
  isPending?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
}

export default function AdminListState({
  isPending,
  isError,
  isEmpty,
  emptyMessage = "표시할 항목이 없습니다.",
  errorMessage = "목록을 불러오지 못했습니다.",
}: AdminListStateProps) {
  if (isPending) {
    return (
      <div className="text-14-regular text-gray-4 py-2xl text-center">
        로딩 중...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-14-regular text-red-5 py-2xl text-center">
        {errorMessage}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="text-14-regular text-gray-4 py-2xl text-center">
        {emptyMessage}
      </div>
    );
  }
  return null;
}
