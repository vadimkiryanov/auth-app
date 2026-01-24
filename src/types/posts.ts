export type Post = {
  id: number;
  author: string;
  title: string;
  description: string;
  created_at: string;
};

export type PostCreateData = {
  userName: string;
  title: string;
  description: string;
};

