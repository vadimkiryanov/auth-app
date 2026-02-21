import { PostWithRating } from './src/api/aggregated';
import { PaginatedResult, Post } from './src/types/posts';
import type { Comment } from './src/types/comments';
import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Агрегирующий эндпоинт для постов с рейтингами и комментариями
app.get('/api/posts-with-ratings', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Извлекаем токен из заголовков запроса клиента
    const authHeader = req.headers.authorization || '';

    // Получаем посты
    const postsResponse = await axios.get<PaginatedResult>(`http://localhost:8000/posts/all-paginated?page=${page}&limit=${limit}&offset=${offset}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const postsData = postsResponse.data;

    // Для каждого поста получаем рейтинг и комментарии
    const postsWithRatings: PostWithRating[] = await Promise.all(postsData.data.map(async (post: Post) => {
      try {
        const ratingResponse = await axios.get(`http://localhost:8000/ratings/stats/${post.id}/user`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });

        const ratingData = ratingResponse.data;

        // Конвертируем user_vote в правильный формат
        const userVote = ratingData.stats?.user_vote;
        let convertedUserVote: 'like' | 'dislike' | null = null;
        if (userVote === 'like') {
          convertedUserVote = 'like';
        } else if (userVote === 'dislike') {
          convertedUserVote = 'dislike';
        }

        // Получаем комментарии (только первые 2)
        let comments: Comment[] = [];
        try {
          const commentsResponse = await axios.get<{ comments: Comment[] }>(`http://localhost:8000/comments/post/${post.id}`, {
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json'
            }
          });

          comments = (commentsResponse.data.comments || []).slice(0, 2);
        } catch (error) {
          console.error(`Не удалось получить комментарии для поста ${post.id}:`, error);
        }

        return {
          id: post.id,
          author: post.author,
          title: post.title,
          description: post.description,
          created_at: post.created_at,
          updated_at: post.updated_at,
          rating: {
            likes: ratingData.stats?.likes || 0,
            dislikes: ratingData.stats?.dislikes || 0,
            userVote: convertedUserVote,
          },
          comments
        };
      } catch (error) {
        console.error(`Не удалось получить рейтинги для поста ${post.id}:`, error);
        // Возвращаем пост с пустым рейтингом в случае ошибки
        return {
          id: post.id,
          author: post.author,
          title: post.title,
          description: post.description,
          created_at: post.created_at,
          updated_at: post.updated_at,
          rating: {
            likes: 0,
            dislikes: 0,
            userVote: null,
          },
          comments: []
        };
      }
    }));

    // Формируем ответ с постами и их рейтингами
    const responsePayload = {
      data: postsWithRatings,
      total: postsData.total,
      page: postsData.page,
      limit: postsData.limit,
      total_pages: postsData.total_pages
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Ошибка в endpoint постов с рейтингами:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Эндпоинт для получения поста с комментариями
app.get('/api/posts/:postId', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const authHeader = req.headers.authorization || '';

    // Получаем посты и ищем нужный по ID (т.к. на бэке нет эндпоинта для одного поста)
    const postsResponse = await axios.get<PaginatedResult>(`http://localhost:8000/posts/all-paginated?page=1&limit=100`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const postsData = postsResponse.data;
    const post = postsData.data.find(p => p.id === parseInt(postId as string));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Получаем рейтинг поста
    let rating = { likes: 0, dislikes: 0, userVote: null as 'like' | 'dislike' | null };
    try {
      const ratingResponse = await axios.get(`http://localhost:8000/ratings/stats/${postId}/user`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });

      const ratingData = ratingResponse.data;
      const userVote = ratingData.stats?.user_vote;
      let convertedUserVote: 'like' | 'dislike' | null = null;
      if (userVote === 'like') {
        convertedUserVote = 'like';
      } else if (userVote === 'dislike') {
        convertedUserVote = 'dislike';
      }

      rating = {
        likes: ratingData.stats?.likes || 0,
        dislikes: ratingData.stats?.dislikes || 0,
        userVote: convertedUserVote,
      };
    } catch (error) {
      console.error(`Не удалось получить рейтинг для поста ${postId}:`, error);
    }

    // Получаем комментарии
    let comments: Comment[] = [];
    try {
      const commentsResponse = await axios.get<{ comments: Comment[] }>(`http://localhost:8000/comments/post/${postId}`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });

      comments = commentsResponse.data.comments || [];
    } catch (error) {
      console.error(`Не удалось получить комментарии для поста ${postId}:`, error);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      post: {
        ...post,
        rating
      },
      comments
    });
  } catch (error: any) {
    console.error('Ошибка в endpoint поста с комментариями:', error);
    const status = error.response?.status || 500;
    res.status(status).json({ error: 'Failed to fetch post details' });
  }
});

app.listen(PORT, () => {
  console.log(`BFF сервер запущен на http://localhost:${PORT}`);
});