import type { BoardCategory } from "./api.model";

export type { BoardCategory } from "./api.model";

export type { BoardListItem as BoardPost } from "./api.model";
export type { GetBoardDetailResponse as BoardDetail } from "./api.model";
export type { HotBoardListItem as HotBoardPost } from "./api.model";
export type { MyBoardListItem as MyBoardPost } from "./api.model";
export type { PostBoardRequest as BoardWriteForm } from "./api.model";
export type { BoardEmojiInfo } from "./api.model";
export type { BoardFileInfo } from "./api.model";

export const CATEGORY = {
  NOTICE: "notice",
  FREE: "free",
  QUESTION: "question",
  INFORMATION: "information",
} as const;

export type CategoryTab = (typeof CATEGORY)[keyof typeof CATEGORY];

export const TAB_TO_BOARD_CATEGORY: Record<CategoryTab, BoardCategory> = {
  [CATEGORY.NOTICE]: "NOTICE",
  [CATEGORY.FREE]: "FREE",
  [CATEGORY.QUESTION]: "DEVELOPMENT_QNA",
  [CATEGORY.INFORMATION]: "INFORMATION_REVIEWS",
};
