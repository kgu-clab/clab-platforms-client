import { Button } from "@clab/design-system";

import { MOCK_CATEGORIES } from "@/mock/community";

export interface CommunityWriteSelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CommunityWriteSelector({
  selectedCategory,
  onSelectCategory,
}: CommunityWriteSelectorProps) {
  return (
    <div className="gap-md scrollbar-hide flex items-center overflow-x-auto">
      {MOCK_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <Button
            key={category.id}
            size="small"
            color={isSelected ? "outlineActive" : "outlineDisabled"}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
