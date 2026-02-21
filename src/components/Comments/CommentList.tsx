import type { Comment } from '../../types/comments';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  onEdit: (content: string) => void;
  onDelete: (commentId: number) => void;
  editingCommentId: number | null;
  onStartEdit: (commentId: number) => void;
  onCancelEdit: () => void;
  editContent: string;
  setEditContent: (content: string) => void;
}

function CommentList({ comments, onEdit, onDelete, editingCommentId, onStartEdit, onCancelEdit, editContent, setEditContent }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Комментариев пока нет. Будьте первым!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          isEditing={editingCommentId === comment.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          editContent={editingCommentId === comment.id ? editContent : comment.content}
          setEditContent={setEditContent}
        />
      ))}
    </div>
  );
}

export default CommentList;
