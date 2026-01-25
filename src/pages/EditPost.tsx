// src/pages/EditPost.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsApi } from '../api/posts';
import { useAuthStore } from '../store/auth/useAuthStore';
import { toast } from 'sonner';
import type { Post } from '../types/posts';

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // Загружаем данные поста при монтировании компонента
  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !user) {
        toast.error('Пост не найден или вы не авторизованы');
        navigate('/posts/all');
        return;
      }

      try {
        // Получаем все посты и находим нужный по ID
        const response = await postsApi.getAll();
        const data = await response;
        const postToEdit = data.posts.find((post: Post) => post.id === parseInt(id));

        if (!postToEdit) {
          toast.error('Пост не найден');
          navigate('/posts/all');
          return;
        }

        // Проверяем, является ли пользователь автором поста
        if (postToEdit.author !== user.name) {
          toast.error('Вы не можете редактировать чужой пост');
          navigate('/posts/all');
          return;
        }

        // Устанавливаем значения полей формы
        setTitle(postToEdit.title);
        setDescription(postToEdit.description);
      } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
        toast.error('Ошибка при загрузке поста');
        navigate('/posts/all');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Пожалуйста, войдите в систему');
      return;
    }

    if (!id) {
      toast.error('ID поста не определен');
      return;
    }

    try {
      const response = await postsApi.update(parseInt(id), { 
        title, 
        description, 
        userName: user.name 
      });

      if (response.ok) {
        toast.success('Пост успешно обновлен!');
        navigate('/posts/all');
      } else {
        toast.error('Ошибка при обновлении поста');
      }
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
      toast.error('Ошибка при обновлении поста');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Загрузка поста...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">
          Редактировать пост
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Например: Мой первый пост"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         min-h-[120px] resize-y"
              placeholder="Напишите что-нибудь..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                         py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Сохранить
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/posts/all')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium
                         py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;