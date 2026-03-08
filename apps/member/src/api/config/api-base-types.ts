/* API 문서 확인 후 실제 타입에 따라 정의 수정
핸들러 함수에서 Type Parameter로 넘기는 BaseType
 **/

export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

export type ApiResponseWithoutResult = {
  code: string;
  message: string;
};

export type BaseApiResponse<T> = {
  success: boolean;
  data: T;
};

export type BasePaginationResponse<T> = BaseApiResponse<{
  currentPage: number;
  hasPrevious: true;
  hasNext: true;
  totalPages: number;
  totalItems: number;
  take: number;
  items: T;
}>;

export type PagedResponse<T> = {
  items: T[];
  currentPage: number;
  totalPage: number;
  totalItems: number;
};

export type PaginationParams = {
  page?: number;
  size?: number;
  sortBy?: string[];
  sortDirection?: string[];
};

export const ACCUSATIONS_PAGE_SIZE = 20;
export const BOOKS_PAGE_SIZE = 20;
export const SUPPORTS_PAGE_SIZE = 20;
