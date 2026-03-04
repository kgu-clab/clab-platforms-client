import { Button } from "@clab/design-system";

import { BOOK_STATUS, type BookStatus } from "@/types/library";

const FILTER_OPTIONS: { label: string; value: BookStatus }[] = [
  { label: "전체", value: BOOK_STATUS.ALL },
  { label: "대여가능", value: BOOK_STATUS.AVAILABLE },
  { label: "대여중", value: BOOK_STATUS.BORROWED },
];

type LibraryFilterProps = {
  activeFilter: BookStatus;
  onActiveFilterChange: (value: BookStatus) => void;
};

export default function LibraryFilter({
  activeFilter,
  onActiveFilterChange,
}: LibraryFilterProps) {
  return (
    <div className="px-gutter gap-md flex items-center">
      <div className="scrollbar-hide min-w-0 flex-1 overflow-x-auto">
        <div className="gap-lg flex overflow-auto">
          {FILTER_OPTIONS.map((filter) => (
            <Button
              key={filter.value}
              color={activeFilter === filter.value ? "outlineActive" : "ghost"}
              size="small"
              onClick={() => onActiveFilterChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      {/* <Button
        color="text"
        size="small"
        className="shrink-0"
        onClick={onSortToggle}
      >
        {isLatest ? "최신순" : "인기순"}
      </Button> */}
    </div>
  );
}
