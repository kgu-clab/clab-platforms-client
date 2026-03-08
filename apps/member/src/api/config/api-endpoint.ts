export const END_POINT = {
  AUTH: {
    REISSUE_TOKEN: "v1/auth/reissue", // 실제 문서 확인 후 수정 필요
    LOGIN: "login",
  },
  LIBRARY: {
    BOOKS: "books",
    BOOKS_LOAN: "book-loan-records",
    BOOKS_LOAN_CONDITIONS: "book-loan-records/conditions",
  },
  USER: {
    INFO: "members/my-profile",
    UPDATE: (memberId: string) => `members/${memberId}`,
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
      PROFILE: "files/profiles",
    },
  },
  ACTIVITY: {
    LIST_BY_CATEGORY: "activity-group/member/list",
    LIST_BY_STATUS: "activity-group/status/list",
    DETAIL: (activityGroupId: number) =>
      `activity-group/member/${activityGroupId}`,
    APPLY: "activity-group/member/apply",
  },
  SUPPORT: {
    BASE: "supports",
    DETAIL: (supportId: number) => `supports/${supportId}`,
    MY_SUPPORTS: "supports/my-supports",
    ANSWER: (supportId: number) => `supports/${supportId}/answer`,
    FILE: "files/supports",
  },
};
