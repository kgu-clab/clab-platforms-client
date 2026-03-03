import type { PaginationParams } from "@/api/config";

export type NewsResponseDto = {
  id: number;
  category: string;
  title: string;
  articleUrl: string;
  createdAt: string;
  date: string;
};

export type NewsDetailsResponseDto = {
  id: number;
  category: string;
  title: string;
  content: string;
  imageUrl: string;
  source: string;
  articleUrl: string;
  createdAt: string;
};

export type GetNewsParams = PaginationParams & {
  title?: string;
  category?: string;
};
