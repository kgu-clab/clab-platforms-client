export function createURL(path: string): string {
  return path;
}

export interface PaginationParams {
  recruitmentId?: number;
  page?: number;
  size?: number;
}

export function createPagination(basePath: string, params: PaginationParams): string {
  const search = new URLSearchParams();
  if (params.recruitmentId != null) search.set('recruitmentId', String(params.recruitmentId));
  if (params.page != null) search.set('page', String(params.page));
  if (params.size != null) search.set('size', String(params.size));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
