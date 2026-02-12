import type { Post, PostCreateData } from '../types/posts';
import { getAuthToken } from './auth';
import { API_BASE_POSTS } from './config';

export const postsApi = {
  async getAll(): Promise<{ posts: Post[] }> {
    const token = getAuthToken();
    const authField = token ? { Authorization: getAuthToken() } : undefined;
    return fetch(`${API_BASE_POSTS}/all`, {
      method: 'GET',
      headers: {
        ...authField,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      // console.log(res.json());
      return res.json();
    });
  },

  async create(data: PostCreateData): Promise<Response> {
    return fetch(`${API_BASE_POSTS}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Authorization: getAuthToken(),
      },
      body: JSON.stringify(data),
    });
  },

  async delete(postId: number): Promise<Response> {
    return fetch(`${API_BASE_POSTS}/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
    });
  },

  async update(postId: number, data: PostCreateData): Promise<Response> {
    return fetch(`${API_BASE_POSTS}/update/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
      body: JSON.stringify(data),
    });
  },
};
