export type ToastMessages = {
  success?: string;
  error: string;
};

export const TOAST_MESSAGES = {
  ACTIVITY_CREATE_SUCCESS: {
    success: "활동이 생성되었습니다.",
    error: "활동 생성에 실패했습니다.",
  },
  ACTIVITY_UPDATE_SUCCESS: {
    success: "활동이 수정되었습니다.",
    error: "활동 수정에 실패했습니다.",
  },
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
  PASSWORD_UPDATE: {
    success: "비밀번호가 변경되었습니다.",
    error: "비밀번호 변경에 실패했습니다.",
  },
  PROFILE_UPDATE: {
    success: "프로필이 수정되었습니다.",
    error: "프로필 수정에 실패했습니다.",
  },
  PROFILE_IMAGE_UPDATE: {
    success: "프로필 이미지가 변경되었습니다.",
    error: "프로필 이미지 변경에 실패했습니다.",
  },
  SUPPORT_CREATE: {
    success: "문의가 등록되었습니다.",
    error: "문의 등록에 실패했습니다.",
  },
  SUPPORT_UPDATE: {
    success: "문의가 수정되었습니다.",
    error: "문의 수정에 실패했습니다.",
  },
  SUPPORT_DELETE: {
    success: "문의가 삭제되었습니다.",
    error: "문의 삭제에 실패했습니다.",
  },
  ANSWER_CREATE: {
    success: "답변이 등록되었습니다.",
    error: "답변 등록에 실패했습니다.",
  },
  ANSWER_UPDATE: {
    success: "답변이 수정되었습니다.",
    error: "답변 수정에 실패했습니다.",
  },
  ANSWER_DELETE: {
    success: "답변이 삭제되었습니다.",
    error: "답변 삭제에 실패했습니다.",
  },
} as const;
