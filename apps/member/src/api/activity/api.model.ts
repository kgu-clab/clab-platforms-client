import type {
  BaseApiResponse,
  BasePaginationResponse,
} from "../config/api-base-types";

export type ActivityCategory = "STUDY" | "PROJECT";
export type ActivityStatus = "WAITING" | "PROGRESSING" | "END";

export type GetActivitiyByCategoryRequest = {
  category: ActivityCategory;
  page: number;
  size: number;
};

export type GetActivitiyByCategoryResponse = BasePaginationResponse<
  {
    id: number;
    name: string;
    category: ActivityCategory;
    subject: string;
    status: ActivityStatus;
    imageUrl: string;
    createdAt: string;
  }[]
>;

export type GetActivitiyByStatusRequest = {
  status: ActivityStatus;
  page: number;
  size: number;
};

export type GetActivitiyByStatusResponse = BasePaginationResponse<
  {
    id: number;
    name: string;
    content: string;
    category: ActivityCategory;
    subject: string;
    imageUrl: string;
    leaders: [
      {
        id: string;
        name: string;
      },
    ];
    participantCount: number;
    weeklyActivityCount: number;
    createdAt: string;
  }[]
>;

export type GetActivitiyDetailRequest = {
  activityGroupId: number;
};

export type GetActivitiyDetailResponse = BaseApiResponse<{
  id: number;
  category: ActivityCategory;
  subject: string;
  name: string;
  content: string;
  status: ActivityStatus;
  progress: number;
  imageUrl: string;
  curriculum: string;
  groupMembers: [
    {
      memberId: string;
      memberName: string;
      role: string;
      status: ActivityStatus;
    },
  ];
  startDate: string;
  endDate: string;
  techStack: string;
  githubUrl: string;
  activityGroupBoards: [
    {
      id: number;
      memberId: string;
      memberName: string;
      parentId: number;
      category: string;
      title: string;
      content: string;
      files: [
        {
          fileUrl: string;
          originalFileName: string;
          storagePeriod: number;
          createdAt: string;
        },
      ];
      dueDateTime: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
  createdAt: string;
  owner: boolean;
  isOwner: boolean;
}>;

export type PostActivityApplyRequest = {
  activityGroupId: number;
  applyReason: string;
};
