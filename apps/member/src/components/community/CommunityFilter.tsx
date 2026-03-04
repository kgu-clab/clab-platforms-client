import { Button, Dropdown } from "@clab/design-system";
import { IoChevronDown } from "react-icons/io5";
import { useSearchParams } from "react-router";

import { useHashtagFilterOptions } from "@/hooks/useHashtagFilterOptions";
import { CATEGORY } from "@/api/community";

interface CommunityFilterProps {
  tab: string;
}

export default function CommunityFilter({ tab }: CommunityFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "latest";

  const toggleSort = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", sort === "latest" ? "popular" : "latest");
      return next;
    });
  };

  return (
    <div className="px-gutter gap-md flex items-center">
      <div className="scrollbar-hide min-w-0 flex-1 overflow-x-auto">
        {tab === CATEGORY.INFORMATION && <InformationFilterOptions />}
        {tab === CATEGORY.QUESTION && <QuestionFilterOptions />}
      </div>
      {tab !== CATEGORY.INFORMATION && (
        <Button
          color="text"
          size="small"
          className="shrink-0"
          onClick={toggleSort}
        >
          {sort === "latest" ? "최신순" : "인기순"}
        </Button>
      )}
    </div>
  );
}

export const INFORMATION_FILTERS = ["전체", "IT 소식", "채용 정보"] as const;

function InformationFilterOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter") ?? INFORMATION_FILTERS[0];

  const handleFilter = (filter: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filter === INFORMATION_FILTERS[0]) {
        next.delete("filter");
      } else {
        next.set("filter", filter);
      }
      return next;
    });
  };

  return (
    <div className="gap-lg flex overflow-auto">
      {INFORMATION_FILTERS.map((filter) => (
        <Button
          key={filter}
          color={activeFilter === filter ? "outlineActive" : "ghost"}
          size="small"
          onClick={() => handleFilter(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}

interface FilterOption {
  label: string;
  value: string;
}

function QuestionFilterOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { languageOptions, fieldOptions, techOptions } =
    useHashtagFilterOptions();

  const language = searchParams.get("language") ?? "all";
  const field = searchParams.get("field") ?? "all";
  const tech = searchParams.get("tech") ?? "all";

  const handleChange = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const getSelectedLabel = (options: FilterOption[], value: string) => {
    return (
      options.find((opt) => opt.value === value)?.label ?? options[0].label
    );
  };

  const dropdowns = [
    { key: "language", value: language, options: languageOptions },
    { key: "field", value: field, options: fieldOptions },
    { key: "tech", value: tech, options: techOptions },
  ];

  return (
    <div className="gap-md scrollbar-hide flex overflow-y-hidden overflow-x-scroll">
      {dropdowns.map(({ key, value, options }) => (
        <Dropdown
          key={key}
          trigger={
            <Button
              color={value === "all" ? "outlineDisabled" : "outlineActive"}
              size="small"
              className="shrink-0 whitespace-nowrap"
            >
              {getSelectedLabel(options, value)}
              <IoChevronDown className="ml-xs" />
            </Button>
          }
          align="start"
        >
          {options.map((option) => (
            <Dropdown.Item
              key={option.value}
              onSelect={() => handleChange(key, option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ))}
    </div>
  );
}
