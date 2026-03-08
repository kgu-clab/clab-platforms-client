import type { PaginationParams } from "@/api/config";

export type BoardCategory =
  | "NOTICE"
  | "FREE"
  | "DEVELOPMENT_QNA"
  | "INFORMATION_REVIEWS"
  | "ORGANIZATION";

export type BoardHashtagInfo = {
  id: number;
  boardId: number;
  hashtagId: number;
  name: string;
};

export type BoardFileInfo = {
  fileUrl: string;
  originalFileName: string;
  storagePeriod: number;
  createdAt: string;
};

export type BoardEmojiInfo = {
  emoji: string;
  count: number;
  isOwner: boolean;
};

export type BoardListItem = {
  id: number;
  category: string;
  writerId: string | null; // 익명 게시글인 경우 null
  writerName: string;
  title: string;
  commentCount: number;
  imageUrl: null;
  createdAt: string;
  boardHashtagInfos: BoardHashtagInfo[];
};

export type HotBoardListItem = {
  id: number;
  writerId: string;
  writerName: string;
  category: string;
  title: string;
  content: string;
  commentCount: number;
  imageUrl: string;
  boardHashtagInfos: BoardHashtagInfo[];
  createdAt: string;
};

export type GetBoardDetailResponse = {
  id: number;
  writerId: string;
  writerName: string;
  writerRoleLevel: number;
  writerImageUrl: string;
  category: string;
  title: string;
  content: string;
  files: BoardFileInfo[];
  imageUrl: string;
  emojiInfos: BoardEmojiInfo[];
  boardHashtagInfos: BoardHashtagInfo[];
  createdAt: string;
  isOwner: boolean;
};

export type MyBoardListItem = {
  id: number;
  category: string;
  writerName: string;
  title: string;
  imageUrl: string;
  boardHashtagInfos: BoardHashtagInfo[];
  createdAt: string;
};

export type PostBoardEmojiResponse = {
  boardId: number;
  emoji: string;
  count: number;
  isOwner: boolean;
};

export type PostBoardRequest = {
  category: BoardCategory;
  title: string;
  content: string;
  wantAnonymous: boolean;
  fileUrlList?: string[];
  imageUrl?: string;
  hashtagNames?: string[];
};

export type PatchBoardRequest = {
  wantAnonymous: boolean;
  category?: BoardCategory;
  title?: string;
  content?: string;
  imageUrl?: string;
  hashtagNames?: string[];
};

export type GetBoardsByCategoryRequest = PaginationParams & {
  category: BoardCategory;
};

export type GetBoardsByHashtagRequest = PaginationParams & {
  hashtags: string[];
};

export type GetMyBoardsRequest = PaginationParams;
