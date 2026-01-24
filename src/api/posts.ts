import type { Post, PostCreateData } from '../types/posts';

const API_BASE = 'http://localhost:8000/posts';

export const postsApi = {
  async getAll(): Promise<{ posts: Post[] }> {
    return fetch(`${API_BASE}/all`, {
      method: 'GET',
      headers: {
        Authorization: `${JSON.parse(localStorage.getItem('auth-store')).state.user.token}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      // console.log(res.json());
      return res.json();
    });
  },

  async create(data: PostCreateData): Promise<Response> {
    return fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',

        Authorization: `${JSON.parse(localStorage.getItem('auth-store')).state.user.token}`,

       },
      body: JSON.stringify(data),
    });
  },

  async delete(postId: number): Promise<Response> {
    return fetch(`${API_BASE}/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${JSON.parse(localStorage.getItem('auth-store')).state.user.token}`,
      },
    });
  },
};
