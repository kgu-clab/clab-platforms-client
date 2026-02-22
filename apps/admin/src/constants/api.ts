export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : '');

export const END_POINT = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REISSUE: '/v1/auth/reissue',
  },
  APPLICATION_CONDITION: '/v1/applications/conditions',
  APPLICATION_APPROVE: (recruitmentId: number, studentId: string) =>
    `/v1/applications/${recruitmentId}/${studentId}/approve`,
  APPLICATION_REJECT: (recruitmentId: number, studentId: string) =>
    `/v1/applications/${recruitmentId}/${studentId}/reject`,
  APPLICATION_MEMBER: (recruitmentId: number, studentId: string) =>
    `/v1/applications/${recruitmentId}/${studentId}/member`,
  APPLICATION_MEMBERS: (recruitmentId: number) => `/v1/applications/${recruitmentId}/members`,
} as const;
