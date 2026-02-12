import type { RatingResponse } from '../types/ratings';
import { getAuthToken } from './auth';
import { API_BASE } from './config';

export const ratingsApi = {
  async getRatings(postId: number): Promise<RatingResponse> {
    const url = getAuthToken()
      ? `${API_BASE}/ratings/stats/${postId}/user`
      : `${API_BASE}/ratings/stats/${postId}`;

    return fetch(url, {
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

  async vote(postId: number, data: { action: string }): Promise<Response> {
    return fetch(`${API_BASE}/ratings/vote/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
      body: JSON.stringify(data.action),
    });
  },
};
