import { z } from 'zod';

export const applicationListItemSchema = z.object({
  studentId: z.string(),
  recruitmentId: z.number(),
  name: z.string(),
  contact: z.string(),
  email: z.string(),
  department: z.string(),
  grade: z.number(),
  birth: z.string(),
  address: z.string(),
  interests: z.string(),
  otherActivities: z.string(),
  githubUrl: z.string(),
  applicationType: z.enum(['NORMAL', 'MEISTER', 'etc']),
  isPass: z.boolean(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export type ApplicationListItem = z.infer<typeof applicationListItemSchema>;

/** 페이지네이션 메타 */
export const paginationMetaSchema = z.object({
  currentPage: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
  totalPages: z.number(),
  totalItems: z.number(),
  take: z.number(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export const applicationListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    currentPage: z.number(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    totalPages: z.number(),
    totalItems: z.number(),
    take: z.number(),
    items: z.array(applicationListItemSchema),
  }),
});

export type ApplicationListResponse = z.infer<typeof applicationListResponseSchema>;
