import { useEffect, useState } from 'react';
import type { PaginatedResult } from '../types/posts';
import { postsApi } from '../api/posts';
import { toast } from 'sonner';
import type { RatingData } from '../types/ratings';
import { ratingsApi } from '../api/ratings';
import PostCard from '../components/Posts/PostCard';
import PaginationControls from '../components/Posts/PaginationControls';



function AllPosts() {
  const [paginatedPosts, setPaginatedPosts] = useState<PaginatedResult>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [postRatings, setPostRatings] = useState<Record<number, RatingData>>({});

  const limit = 10; // Number of posts per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch paginated posts
        const postsResponse = await postsApi.getAllPaginated(currentPage, limit);
        setPaginatedPosts(postsResponse);

        // Fetch ratings for each post
        const ratingsMap: Record<number, RatingData> = {};
        for (const post of postsResponse.data) {
          try {
            const ratingResponse = await ratingsApi.getRatings(post.id);
            // API returns stats object with likes and dislikes
            // Convert user_vote string to proper enum type
            const userVote = ratingResponse.stats?.user_vote;
            let convertedUserVote: 'like' | 'dislike' | null = null;
            if (userVote === 'like') {
              convertedUserVote = 'like';
            } else if (userVote === 'dislike') {
              convertedUserVote = 'dislike';
            }

            ratingsMap[post.id] = {
              likes: ratingResponse.stats?.likes || 0,
              dislikes: ratingResponse.stats?.dislikes || 0,
              userVote: convertedUserVote,
            };
          } catch (error) {
            console.error(`Failed to fetch ratings for post ${post.id}:`, error);
            // Set default values if rating fetch fails
            ratingsMap[post.id] = {
              likes: 0,
              dislikes: 0,
              userVote: null,
            };
          }
        }
        setPostRatings(ratingsMap);
      } catch (error) {
        console.error('Не удалось загрузить посты', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);
  const handleDelete = async (postId: number) => {
    setDeletingPostId(postId);

    try {
      const response = await postsApi.delete(postId);

      if (response.ok) {
        // Refresh the current page after deletion
        const postsResponse = await postsApi.getAllPaginated(currentPage, limit);
        setPaginatedPosts(postsResponse);
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

  // Handle pagination navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginatedPosts.total_pages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < paginatedPosts.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Посты пользователей</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Загрузка постов...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedPosts.data?.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  rating={postRatings[post.id] || { likes: 0, dislikes: 0, userVote: null }}
                  onDelete={handleDelete}
                  deletingPostId={deletingPostId}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {paginatedPosts.total_pages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={paginatedPosts.total_pages}
                totalItems={paginatedPosts.total}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrev={prevPage}
              />
            )}

            {paginatedPosts.data.length === 0 && !loading && (
              <p className="text-sm text-gray-500 text-center py-4">Постов пока нет.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllPosts;
