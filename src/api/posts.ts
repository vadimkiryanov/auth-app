import type { Post, PostCreateData } from '../types/posts';

const API_BASE = 'http://localhost:8000/posts';

// Helper function to get authorization token safely
const getAuthToken = (): string => {
  const authStore = localStorage.getItem('auth-store');
  if (!authStore) {
    throw new Error('Authentication token not found');
  }
  const parsedStore = JSON.parse(authStore);
  return parsedStore.state.user.token;
};

export const postsApi = {
  async getAll(): Promise<{ posts: Post[] }> {
    return fetch(`${API_BASE}/all`, {
      method: 'GET',
      headers: {
        Authorization: getAuthToken(),
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

        Authorization: getAuthToken(),

       },
      body: JSON.stringify(data),
    });
  },

  async delete(postId: number): Promise<Response> {
    return fetch(`${API_BASE}/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
    });
  },

  async update(postId: number, data: PostCreateData): Promise<Response> {
    return fetch(`${API_BASE}/update/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
      body: JSON.stringify(data),
    });
  },
};
