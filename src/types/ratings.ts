export type RatingData = {
  likes: number;
  dislikes: number;
  userVote: 'like' | 'dislike' | null;
};

type RatingStats = {
  likes: number;
  dislikes: number;
  net_score: number;
  user_vote: string | null;
};

export type RatingResponse = {
  stats: RatingStats;
};
