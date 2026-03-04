export type ToastMessages = {
  success?: string;
  error: string;
};

export const TOAST_MESSAGES = {
  COMMENT_UPDATE: {
    success: "댓글이 수정되었습니다.",
    error: "댓글 수정에 실패했습니다.",
  },
  COMMENT_DELETE: {
    success: "댓글이 삭제되었습니다.",
    error: "댓글 삭제에 실패했습니다.",
  },
  BOARD_UPDATE: {
    success: "게시글이 수정되었습니다.",
    error: "게시글 수정에 실패했습니다.",
  },
  BOARD_DELETE: {
    success: "게시글이 삭제되었습니다.",
    error: "게시글 삭제에 실패했습니다.",
  },
  ACCUSATION: {
    success: "신고가 접수되었습니다.",
    error: "신고 접수에 실패했습니다.",
  },

  COMMENT_CREATE: {
    error: "댓글 작성에 실패했습니다.",
  },
  COMMENT_LIKE: {
    error: "좋아요 처리에 실패했습니다.",
  },
  BOARD_CREATE: {
    error: "게시글 작성에 실패했습니다.",
  },
  BOARD_EMOJI: {
    error: "이모지 추가에 실패했습니다.",
  },
  LOGIN: {
    error: "로그인에 실패했습니다.",
  },
  FILE_UPLOAD: {
    error: "파일 업로드에 실패했습니다.",
  },
} as const;
