import { getAuthToken } from './auth';
import type { Comment } from '../types/comments';

export interface PostWithRating {
  id: number;
  author: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  rating: {
    likes: number;
    dislikes: number;
    userVote: 'like' | 'dislike' | null;
  };
  comments?: Comment[];
}

export interface PostDetailData {
  post: PostWithRating;
  comments: Comment[];
}

export interface AggregatedPaginatedResult {
  data: PostWithRating[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const aggregatedApi = {
  async getPostsWithRatings(page: number = 1, limit: number = 10, sortBy: string = 'created_at', sortOrder: string = 'DESC'): Promise<AggregatedPaginatedResult> {
    const token = getAuthToken();
    const authHeaders = token ? { 'Authorization': token } : undefined;

    const offset = (page - 1) * limit;

    return fetch(`http://localhost:8080/api/posts-with-ratings?page=${page}&limit=${limit}&offset=${offset}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  },

  async getPostDetail(postId: number): Promise<PostDetailData> {
    const token = getAuthToken();
    const authHeaders = token ? { 'Authorization': token } : undefined;

    return fetch(`http://localhost:8080/api/posts/${postId}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  },
};