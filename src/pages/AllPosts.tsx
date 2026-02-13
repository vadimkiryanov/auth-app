import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PostCard from '../components/Posts/PostCard';
import PaginationControls from '../components/Posts/PaginationControls';
import { aggregatedApi, type AggregatedPaginatedResult } from '../api/aggregated';
import { postsApi } from '../api/posts';



function AllPosts() {
  const [paginatedPostsWithRatings, setPaginatedPostsWithRatings] = useState<AggregatedPaginatedResult>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  const limit = 10; // Number of posts per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch posts with ratings in a single request
        const response = await aggregatedApi.getPostsWithRatings(currentPage, limit);
        setPaginatedPostsWithRatings(response);
      } catch (error) {
        console.error('Не удалось загрузить посты с рейтингами', error);
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
        const refreshedResponse = await aggregatedApi.getPostsWithRatings(currentPage, limit);
        setPaginatedPostsWithRatings(refreshedResponse);
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
    if (page >= 1 && page <= paginatedPostsWithRatings.total_pages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < paginatedPostsWithRatings.total_pages) {
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
              {paginatedPostsWithRatings.data?.map((postWithRating) => (
                <PostCard
                  key={postWithRating.id}
                  post={postWithRating}
                  rating={postWithRating.rating}
                  onDelete={handleDelete}
                  deletingPostId={deletingPostId}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {paginatedPostsWithRatings.total_pages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={paginatedPostsWithRatings.total_pages}
                totalItems={paginatedPostsWithRatings.total}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrev={prevPage}
              />
            )}

            {paginatedPostsWithRatings.data.length === 0 && !loading && (
              <p className="text-sm text-gray-500 text-center py-4">Постов пока нет.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllPosts;
