import type { CommentCreateData, CommentUpdateData, CommentsResponse } from '../types/comments';
import { getAuthToken } from './auth';
import { API_BASE } from './config';

export const API_BASE_COMMENTS = API_BASE + '/comments';

export const commentsApi = {
  async getCommentsByPostId(postId: number): Promise<CommentsResponse> {
    const token = getAuthToken();
    const authHeaders = token ? { Authorization: token } : undefined;

    return fetch(`${API_BASE_COMMENTS}/post/${postId}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  },

  async createComment(data: CommentCreateData): Promise<{ id: number }> {
    const token = getAuthToken();
    return fetch(`${API_BASE_COMMENTS}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  async updateComment(commentId: number, data: CommentUpdateData): Promise<{ message: string }> {
    const token = getAuthToken();
    return fetch(`${API_BASE_COMMENTS}/update/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  async deleteComment(commentId: number): Promise<{ message: string }> {
    const token = getAuthToken();
    return fetch(`${API_BASE_COMMENTS}/delete/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((res) => res.json());
  },
};
