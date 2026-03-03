export const END_POINT = {
  AUTH: {
    REISSUE_TOKEN: "v1/auth/reissue", // 실제 문서 확인 후 수정 필요
    LOGIN: "login",
  },
  COMMUNITY: {
    BOARD: {
      BASE: "boards",
      DETAIL: (boardId: number) => `boards/${boardId}`,
      CATEGORY: "boards/category",
      HASHTAG: "boards/hashtag",
      HOT: "boards/hot",
      MY_BOARDS: "boards/my-boards",
      DELETED: "boards/deleted",
      EMOJI: (boardId: number, emoji: string) =>
        `boards/${boardId}/react/${emoji}`,
    },
    COMMENT: {
      BASE: (boardId: number) => `comments/${boardId}`,
      DETAIL: (commentId: number) => `comments/${commentId}`,
      DELETED: (boardId: number) => `comments/deleted/${boardId}`,
      LIKES: (commentId: number) => `comments/likes/${commentId}`,
      MY_COMMENTS: "comments/my-comments",
    },
    ACCUSATION: {
      BASE: "accusations",
      STATUS: (targetType: string, targetId: number) =>
        `accusations/${targetType}/${targetId}`,
      MY: "accusations/my",
    },
    HASHTAG: {
      BASE: "hashtags",
    },
    JOB_POSTING: {
      BASE: "job-postings",
      DETAIL: (jobPostingId: number) => `job-postings/${jobPostingId}`,
    },
    NEWS: {
      BASE: "news",
      DETAIL: (newsId: number) => `news/${newsId}`,
    },
    FILE: {
      BOARD: "files/boards",
    },
  },
};
