export type HashtagCategory = "LANGUAGE" | "FIELD" | "SKILL" | "ETC";

export type HashtagResponseDto = {
  id: number;
  name: string;
  hashtagCategory: HashtagCategory;
  usageCount: number;
};

export type HashtagRequestDto = {
  name: string;
  hashtagCategory: HashtagCategory;
};
