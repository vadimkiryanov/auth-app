import { PostWithRating } from './src/api/aggregated';
import { PaginatedResult, Post } from './src/types/posts';
import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Агрегирующий эндпоинт для постов с рейтингами
app.get('/api/posts-with-ratings', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    // Извлекаем токен из заголовков запроса клиента
    const authHeader = req.headers.authorization || '';

    // Получаем посты
    const postsResponse = await axios.get<PaginatedResult>(`http://localhost:8000/posts/all-paginated?page=${page}&limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    const postsData = postsResponse.data;
    
    // Для каждого поста получаем рейтинг
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
        
        return {
          id: post.id,
          author: post.author, // предполагаем, что author может быть в одном из полей
          title: post.title,
          description: post.description, // предполагаем, что контент может быть в одном из полей
          created_at: post.created_at,
          updated_at: post.updated_at,
          rating: {
            likes: ratingData.stats?.likes || 0,
            dislikes: ratingData.stats?.dislikes || 0,
            userVote: convertedUserVote,
          }
        };
      } catch (error) {
        console.error(`Не удалось получить рейтинги для поста ${post.id}:`, error);
        // Возвращаем пост с пустым рейтингом в случае ошибки
        return {
          ...post,
          rating: {
            likes: 0,
            dislikes: 0,
            userVote: null,
          }
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

app.listen(PORT, () => {
  console.log(`BFF сервер запущен на http://localhost:${PORT}`);
});