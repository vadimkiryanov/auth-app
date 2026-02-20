import { useState, useRef, useEffect } from 'react';
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
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <article className="bg-neutral-800 w-full rounded-xl shadow-sm p-4 pb-10"> {/* Added pb-10 to make space for rating at bottom */}
        <header className="flex justify-between items-start mb-2">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-gray-200">{post.title}</h2>
            <p className="text-sm text-gray-200 whitespace-pre-line">{post.description}</p>
            <div className="text-xs text-gray-400 mt-1">
              Автор: {post.author} · {formatDate(post.created_at)} ·{' '}
              {formatDate(post.updated_at)}
            </div>
          </div>
          
          {/* Dropdown menu for author actions */}
          {user && user.name === post.author && (
            <div ref={dropdownRef} className="relative ml-2">
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-gray-200 focus:outline-none"
                aria-label="Меню действий"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-xl bg-neutral-800 shadow-lg shadow-neutral-900 focus:outline-none overflow-hidden">
                  <div className="py-1">
                    <Link
                      to={`/posts/update/${post.id}`}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700 w-full text-left"
                      onClick={() => setShowMenu(false)}
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => {
                        onDelete(post.id);
                        setShowMenu(false);
                      }}
                      disabled={deletingPostId === post.id}
                      className={`block px-4 py-2 text-sm w-full text-left cursor-pointer text-red-500 hover:bg-neutral-700 ${
                        deletingPostId === post.id
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-red-500 hover:bg-neutral-700'
                      }`}
                    >
                      {deletingPostId === post.id ? 'Удаление...' : 'Удалить'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>
  
        {/* Rating section - moved to bottom right */}
        <div className="absolute bottom-2 right-2">
          <Rating
            postId={post.id}
            initialRating={rating}
          />
        </div>
      </article>
    </div>
  );
}

export default PostCard;