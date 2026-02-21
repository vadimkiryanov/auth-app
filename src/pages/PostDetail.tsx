import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDate } from '../utils/dateFormatter';
import { useAuthStore } from '../store/auth/useAuthStore';
import { aggregatedApi, type PostDetailData } from '../api/aggregated';
import CommentForm from '../components/Comments/CommentForm';
import CommentList from '../components/Comments/CommentList';
import Rating from '../components/Rating';

function getAuthHeader(): string {
  const authStore = localStorage.getItem('auth-store');
  if (!authStore) return '';
  const parsed = JSON.parse(authStore);
  const token = parsed.state?.user?.token || '';
  
  // Проверяем формат токена (должен быть JWT: xxxxx.yyyyy.zzzzz)
  if (token && !token.startsWith('Bearer ')) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Неверный формат токена:', token);
    }
  }
  
  return token;
}

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [postData, setPostData] = useState<PostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await aggregatedApi.getPostDetail(parseInt(id));
        setPostData(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Не удалось загрузить пост');
        if (id) {
          navigate('/posts/all');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id, navigate]);

  const handleCreateComment = async (content: string) => {
    if (!id || !isAuthenticated) return;

    try {
      setSubmittingComment(true);
      const token = getAuthHeader();
      const response = await fetch('http://localhost:8000/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          post_id: parseInt(id),
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create comment');
      }

      toast.success('Комментарий добавлен!');

      // Refresh comments
      const data = await aggregatedApi.getPostDetail(parseInt(id));
      setPostData(data);
    } catch (error: any) {
      console.error('Error creating comment:', error);
      toast.error(error.message || 'Не удалось добавить комментарий');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateComment = async (content: string) => {
    if (!editingCommentId) return;
    
    try {
      const token = getAuthHeader();
      const response = await fetch(`http://localhost:8000/comments/update/${editingCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update comment');
      }

      toast.success('Комментарий обновлен!');
      setEditingCommentId(null);
      setEditContent('');

      // Refresh comments
      if (id) {
        const data = await aggregatedApi.getPostDetail(parseInt(id));
        setPostData(data);
      }
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast.error(error.message || 'Не удалось обновить комментарий');
    }
  };

  const handleStartEdit = (commentId: number) => {
    const comment = postData?.comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditContent(comment.content);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = getAuthHeader();
      const response = await fetch(`http://localhost:8000/comments/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }

      toast.success('Комментарий удален!');

      // Refresh comments
      if (id) {
        const data = await aggregatedApi.getPostDetail(parseInt(id));
        setPostData(data);
      }
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error(error.message || 'Не удалось удалить комментарий');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!postData) {
    return null;
  }

  const { post, comments } = postData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Content */}
      <article className="bg-neutral-800 rounded-xl shadow-sm p-6 mb-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-200 mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Автор: {post.author}</span>
            <span>·</span>
            <span>{formatDate(post.created_at)}</span>
            {post.updated_at !== post.created_at && (
              <>
                <span>·</span>
                <span>Обновлено: {formatDate(post.updated_at)}</span>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-gray-300 whitespace-pre-line">{post.description}</p>
        </div>

        <div className="flex justify-end">
          <Rating
            postId={post.id}
            initialRating={post.rating}
          />
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-neutral-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-6">
          Комментарии ({comments.length})
        </h2>

        {isAuthenticated ? (
          <div className="mb-6">
            <CommentForm
              onSubmit={handleCreateComment}
              isLoading={submittingComment}
            />
          </div>
        ) : (
          <div className="mb-6 p-4 bg-neutral-700/50 rounded-xl">
            <p className="text-gray-400 text-sm">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Войдите
              </button>{' '}
              для добавления комментариев
            </p>
          </div>
        )}

        <CommentList
          comments={comments}
          onEdit={handleUpdateComment}
          onDelete={handleDeleteComment}
          editingCommentId={editingCommentId}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          editContent={editContent}
          setEditContent={setEditContent}
        />
      </section>
    </div>
  );
}

export default PostDetail;
