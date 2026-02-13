import { Link } from 'react-router-dom';
import type { Post } from '../../types/posts';
import type { RatingData } from '../../types/ratings';
import Rating from '../Rating';
import { formatDate } from '../../utils/dateFormatter';
import { useAuthStore } from '../../store/auth/useAuthStore';

interface PostCardProps {
  post: Post;
  rating: RatingData;
  onDelete: (postId: number) => void;
  deletingPostId: number | null;
}

function PostCard({ post, rating, onDelete, deletingPostId }: PostCardProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex gap-x-4">
      <article className="bg-white w-full border border-gray-200 rounded-lg shadow-sm p-4">
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

        {/* Rating section */}
        <div className="mt-3">
          <Rating
            postId={post.id}
            initialRating={rating}
          />
        </div>
      </article>

      {/* Кнопки удаления и редактирования видны только автору поста */}
      {user && user.name === post.author && (
        <div className="flex space-x-2 text-sm flex-col gap-y-1 justify-center">
          <Link
            to={`/posts/update/${post.id}`}
            className="px-3 py-1 bg-blue-200 w-full hover:bg-blue-600 text-white rounded"
          >
            ✏️
          </Link>
          <button
            onClick={() => onDelete(post.id)}
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
  );
}

export default PostCard;