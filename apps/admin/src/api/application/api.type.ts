import type { ApplicationListItem } from './api.model';

export interface WithPaginationParams {
  page?: number;
  size?: number;
}

export interface BaseResponse<T> {
  success: boolean;
  data: T;
}

export interface ResponsePagination<T> {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
  totalItems: number;
  take: number;
  items: T[];
}

export type ApplicationMemberType = ApplicationListItem;
