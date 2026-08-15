// 브라우저 요청은 항상 Next.js rewrite를 거친다. 원격/Tailscale dev 접속에서도
// 사용자의 localhost가 아니라 개발 서버가 설정된 API로 프록시해야 한다.
export const API_BASE_URL =
  typeof window !== 'undefined' ? '/api' : process.env.NEXT_PUBLIC_API_URL;
export const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const CHANNEL_TALK_TOKEN = process.env.NEXT_PUBLIC_CHANNEL_TALK_TOKEN;

export const END_POINT = {
  RECRUITMENT: `/v1/recruitments`,
  RECRUITMENT_DETAIL: (recruitmentId: number) => `/v1/recruitments/${recruitmentId}`,
  RECENT_RECRUITMENT: '/v1/recruitments/recent-week',
  APPLICATIONS: `/v1/applications`,
  APPLY_PASSED: (recruitmentId: number, studentId: string) =>
    `/v1/applications/${recruitmentId}/${studentId}`,
  EXECUTIVE: `/v1/executive`,
  OPEN: `/v1/recruitments/open`,
} as const;
