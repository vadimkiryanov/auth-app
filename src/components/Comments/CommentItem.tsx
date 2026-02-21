import { useState, useRef, useEffect } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { useAuthStore } from '../../store/auth/useAuthStore';
import type { Comment } from '../../types/comments';

interface CommentItemProps {
  comment: Comment;
  onEdit: (content: string) => void;
  onDelete: (commentId: number) => void;
  isEditing: boolean;
  onStartEdit: (commentId: number) => void;
  onCancelEdit: () => void;
  editContent: string;
  setEditContent: (content: string) => void;
}

function CommentItem({ comment, onEdit, onDelete, isEditing, onStartEdit, onCancelEdit, editContent, setEditContent }: CommentItemProps) {
  const user = useAuthStore((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isAuthor = user?.name === comment.author;

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

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmitEdit = () => {
    if (editContent.trim()) {
      onEdit(editContent.trim());
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    onCancelEdit();
  };

  return (
    <div className="bg-neutral-700/50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-200">{comment.author}</span>
          {comment.created_at && (
            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
          )}
        </div>

        {isAuthor && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Меню действий"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-lg bg-neutral-800 shadow-lg shadow-neutral-900 overflow-hidden">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onStartEdit(comment.id!);
                      setShowMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700 w-full text-left"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => {
                      onDelete(comment.id!);
                      setShowMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-neutral-700 w-full text-left"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-neutral-800 text-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmitEdit}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 bg-neutral-600 hover:bg-neutral-500 text-white text-sm rounded-lg transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300 text-sm whitespace-pre-line">{comment.content}</p>
      )}
    </div>
  );
}

export default CommentItem;
