export type Comment = {
  author: string;
  post_id: number;
  user_id: number;
  content: string;
  id?: number;
  created_at?: string;
  updated_at?: string;
};

export type CommentCreateData = {
  post_id: number;
  content: string;
};

export type CommentUpdateData = {
  content: string;
};

export type CommentsResponse = {
  comments: Comment[];
};
