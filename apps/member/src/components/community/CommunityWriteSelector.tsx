import { Button, Dropdown, Section } from "@clab/design-system";
import { IoChevronDown } from "react-icons/io5";

import type { BoardCategory } from "@/api/community";
import { useHashtagFilterOptions } from "@/hooks/useHashtagFilterOptions";

const BOARD_CATEGORIES: { id: BoardCategory; label: string }[] = [
  { id: "FREE", label: "자유" },
  { id: "DEVELOPMENT_QNA", label: "개발 Q&A" },
];

export interface CommunityWriteSelectorProps {
  selectedCategory: BoardCategory;
  onSelectCategory: (category: BoardCategory) => void;
  selectedHashtags: string[];
  onSelectHashtag: (hashtags: string[]) => void;
}

export default function CommunityWriteSelector({
  selectedCategory,
  onSelectCategory,
  selectedHashtags,
  onSelectHashtag,
}: CommunityWriteSelectorProps) {
  const handleCategorySelect = (category: BoardCategory) => {
    onSelectCategory(category);
    if (category !== "DEVELOPMENT_QNA") {
      onSelectHashtag([]);
    }
  };

  return (
    <div className="gap-md flex flex-col">
      <div className="gap-md scrollbar-hide flex items-center overflow-x-auto">
        {BOARD_CATEGORIES.map((category) => (
          <Button
            key={category.id}
            size="small"
            color={
              selectedCategory === category.id
                ? "outlineActive"
                : "outlineDisabled"
            }
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
      {selectedCategory === "DEVELOPMENT_QNA" && (
        <Section
          className="gap-xl"
          title={
            <h2 className="text-18-semibold mt-6 text-black">
              해시태그를 선택해주세요.
            </h2>
          }
        >
          <HashtagSelector
            selectedHashtags={selectedHashtags}
            onSelectHashtag={onSelectHashtag}
          />
        </Section>
      )}
    </div>
  );
}

interface HashtagSelectorProps {
  selectedHashtags: string[];
  onSelectHashtag: (hashtags: string[]) => void;
}

function HashtagSelector({
  selectedHashtags,
  onSelectHashtag,
}: HashtagSelectorProps) {
  const { languageOptions, fieldOptions, techOptions } =
    useHashtagFilterOptions();

  const handleSelect = (
    value: string,
    options: { label: string; value: string }[],
  ) => {
    if (value === "all") {
      const valuesInGroup = options
        .filter((opt) => opt.value !== "all")
        .map((opt) => opt.value);
      onSelectHashtag(
        selectedHashtags.filter((h) => !valuesInGroup.includes(h)),
      );
      return;
    }
    if (selectedHashtags.includes(value)) {
      onSelectHashtag(selectedHashtags.filter((h) => h !== value));
    } else {
      onSelectHashtag([...selectedHashtags, value]);
    }
  };

  const getSelectedLabel = (options: { label: string; value: string }[]) => {
    const selected = options.find(
      (opt) => opt.value !== "all" && selectedHashtags.includes(opt.value),
    );
    return selected?.label ?? options[0].label;
  };

  const dropdowns = [
    { key: "language", options: languageOptions },
    { key: "field", options: fieldOptions },
    { key: "tech", options: techOptions },
  ];

  return (
    <div className="gap-md scrollbar-hide flex overflow-y-hidden overflow-x-scroll">
      {dropdowns.map(({ key, options }) => {
        const hasSelection = options.some(
          (opt) => opt.value !== "all" && selectedHashtags.includes(opt.value),
        );

        return (
          <Dropdown
            key={key}
            trigger={
              <Button
                color={hasSelection ? "outlineActive" : "outlineDisabled"}
                size="small"
                className="shrink-0 whitespace-nowrap"
              >
                {getSelectedLabel(options)}
                <IoChevronDown className="ml-xs" />
              </Button>
            }
            align="start"
          >
            {options.map((option) => (
              <Dropdown.Item
                key={option.value}
                onSelect={() => handleSelect(option.value, options)}
              >
                {option.value === "all"
                  ? option.label
                  : selectedHashtags.includes(option.value)
                    ? `✓ ${option.label}`
                    : option.label}
              </Dropdown.Item>
            ))}
          </Dropdown>
        );
      })}
    </div>
  );
}
