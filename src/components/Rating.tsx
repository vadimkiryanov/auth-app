import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth/useAuthStore';
import type { RatingData } from '../types/ratings';
import { ratingsApi } from '../api/ratings';


type RatingProps = {
  postId: number;
  initialRating?: RatingData;
};

const Rating = ({ postId, initialRating }: RatingProps) => {
  const [rating, setRating] = useState<RatingData>({
    likes: initialRating?.likes || 0,
    dislikes: initialRating?.dislikes || 0,
    userVote: initialRating?.userVote || null,
  });
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleVote = async (action: 'like' | 'dislike') => {
    if (loading) return;

    setLoading(true);
    try {
      // Determine if this is toggling off the current vote
      const isTogglingOff = rating.userVote === action;

      await ratingsApi.vote(postId, { action });

      // Update the local state optimistically
      setRating((prev) => {
        let newLikes = prev.likes;
        let newDislikes = prev.dislikes;
        let newUserVote: 'like' | 'dislike' | null = action;

        // If toggling off, remove the vote
        if (isTogglingOff) {
          if (action === 'like') {
            newLikes--;
          } else {
            newDislikes--;
          }
          newUserVote = null;
        }
        // If switching from one vote to another
        else if (prev.userVote) {
          if (prev.userVote === 'like') {
            newLikes--;
          } else {
            newDislikes--;
          }

          if (action === 'like') {
            newLikes++;
          } else {
            newDislikes++;
          }
        }
        // If adding a new vote
        else {
          if (action === 'like') {
            newLikes++;
          } else {
            newDislikes++;
          }
        }

        return {
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newUserVote,
        };
      });
    } catch (error) {
      console.error('Error voting:', error);
      // Optionally fetch fresh data to reset to server state
      try {
        const freshRating = await ratingsApi.getRatings(postId);
        setRating((prev) => ({
          likes: freshRating.stats?.likes || 0,
          dislikes: freshRating.stats?.dislikes || 0,
          userVote: prev.userVote, // Keep the client-side vote state
        }));
      } catch (refreshError) {
        console.error('Error refreshing rating:', refreshError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle like button click
  const handleLikeClick = () => {
    if (rating.userVote === 'like') {
      // Toggle off the like
      handleVote('like');
    } else {
      // Switch to like
      handleVote('like');
    }
  };

  // Handle dislike button click
  const handleDislikeClick = () => {
    if (rating.userVote === 'dislike') {
      // Toggle off the dislike
      handleVote('dislike');
    } else {
      // Switch to dislike
      handleVote('dislike');
    }
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLikeClick}
        disabled={loading || !user?.name}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
          rating.userVote === 'like'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        } ${(loading || !user?.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>👍</span>
        <span>{rating.likes}</span>
      </button>

      <button
        onClick={handleDislikeClick}
        disabled={loading || !user?.name}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
          rating.userVote === 'dislike'
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        } ${(loading || !user?.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>👎</span>
        <span>{rating.dislikes}</span>
      </button>
    </div>
  );
};

export default Rating;
