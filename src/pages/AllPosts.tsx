import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types/posts';
import { postsApi } from '../api/posts';
import { useAuthStore } from '../store/auth/useAuthStore';
import { toast } from 'sonner';
import { formatDate } from '../utils/dateFormatter';

function AllPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = postsApi.getAll();

        const data = await response;
        console.log({ data });
        if (data) {
          setPosts(data.posts);
        }
        setPosts(data?.posts ?? []);
      } catch (error) {
        console.error('Не удалось загрузить посты', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: number) => {
    setDeletingPostId(postId);

    try {
      const response = await postsApi.delete(postId);

      if (response.ok) {
        // Обновляем состояние, убрав удаленный пост
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success('Пост успешно удален!');
      } else {
        alert('Ошибка при удалении поста');
        console.error('Ошибка при удалении поста:', response.status);
      }
    } catch (error) {
      alert('Произошла ошибка при попытке удалить пост');
      console.error('Ошибка при удалении поста:', error);
    } finally {
      setDeletingPostId(null);
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Посты пользователей</h1>

        <div className="space-y-4">
          {posts?.map((post) => (
            <div className="flex  gap-x-4">
              <article
                key={post.id}
                className="bg-whit w-full border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <header className="flex justify-between items-start mb-2">
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{post.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Автор: {post.author} · {formatDate(post.created_at)} ·{' '}
                      {formatDate(post.updated_at)}
                    </div>
                  </div>
                </header>
              </article>

              {/* Кнопки удаления и редактирования видны только автору поста */}
              {user && user.name === post.author && (
                <div className="flex space-x-2 text-sm flex-col gap-y-1  justify-center">
                  <Link
                    to={`/posts/update/${post.id}`}
                    className="px-3 py-1 bg-blue-200 w-full hover:bg-blue-600 text-white rounded"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingPostId === post.id}
                    className={`px-3 py-1 rounded ${
                      deletingPostId === post.id
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-red-200 hover:bg-red-600 text-white'
                    }`}
                  >
                    {deletingPostId === post.id ? 'Удаление...' : '🗑'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {posts.length === 0 && <p className="text-sm text-gray-500">Постов пока нет.</p>}
        </div>
      </div>
    </div>
  );
}

export default AllPosts;
