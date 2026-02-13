export type Post = {
  id: number;
  author: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type PostCreateData = {
  userName: string;
  title: string;
  description: string;
};

export type PaginatedResult = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type PaginationParams = {
  limit: number;
  offset: number;
};

