export interface PaginationParams {
  page: number;
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PaginationResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  skipFullCount?: boolean;
}
