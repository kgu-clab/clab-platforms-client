import { useQuery } from "@tanstack/react-query";

import { hashtagQueries } from "@/api/community";
import type { HashtagCategory } from "@/api/community";

interface FilterOption {
  label: string;
  value: string;
}

const CATEGORY_CONFIG: Record<
  HashtagCategory,
  { key: string; defaultLabel: string }
> = {
  LANGUAGE: { key: "language", defaultLabel: "언어" },
  FIELD: { key: "field", defaultLabel: "분야" },
  SKILL: { key: "tech", defaultLabel: "기술" },
  ETC: { key: "etc", defaultLabel: "기타" },
};

export function useHashtagFilterOptions() {
  const { data, isLoading } = useQuery(hashtagQueries.getHashtagsQuery());

  const hashtags = data ?? [];

  const buildOptions = (category: HashtagCategory): FilterOption[] => {
    const config = CATEGORY_CONFIG[category];
    const items = hashtags
      .filter((h) => h.hashtagCategory === category)
      .map((h) => ({ label: h.name, value: h.name }));

    return [{ label: config.defaultLabel, value: "all" }, ...items];
  };

  return {
    languageOptions: buildOptions("LANGUAGE"),
    fieldOptions: buildOptions("FIELD"),
    techOptions: buildOptions("SKILL"),
    isLoading,
  };
}
