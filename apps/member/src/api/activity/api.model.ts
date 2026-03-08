import type {
  BaseApiResponse,
  BasePaginationResponse,
} from "../config/api-base-types";

export type ActivityCategory = "STUDY" | "PROJECT";
export type ActivityStatus = "WAITING" | "PROGRESSING" | "END";
export type ActivityMemberStatus = "WAITING" | "ACCEPTED" | "REJECTED";
export type ActivityPosition = "LEADER" | "MEMBER";

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

export type GetActivityAppliedResponse = BasePaginationResponse<{
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
}>;

export type PostActivityCreateRequest = {
  category: ActivityCategory;
  subject: string;
  name: string;
  content: string;
  imageUrl: string;
  curriculum: string;
  startDate: string;
  endDate: string;
  techStack: string;
  githubUrl: string;
};

export type PostActivityCreateResponse = BaseApiResponse<number>;

export type PatchActivityUpdateRequest = PostActivityCreateRequest;

export type GetActivityApplicationsRequest = {
  activityGroupId: number;
  page?: number;
  size?: number;
};

export type GetActivityApplicationsResponse = BasePaginationResponse<
  {
    memberId: string;
    memberName: string;
    role: string;
    status: string;
    applyReason: string;
  }[]
>;

export type PatchActivityMemberRoleRequest = {
  activityGroupId: number;
  memberId: string;
  position: ActivityPosition;
};

export type PatchActivityMemberStatusRequest = {
  activityGroupId: number;
  memberId: string;
  status: ActivityMemberStatus;
};

export type PatchActivityChangeStatusRequest = {
  activityGroupId: number;
  activityGroupStatus: ActivityStatus;
};
