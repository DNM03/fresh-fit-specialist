import { useState, useEffect, useRef } from "react";

import { PostFilters, PostFilterValue } from "@/features/community/post-filter";
import { CreatePostForm } from "@/features/community/create-post-form";
import { PostCard } from "@/features/community/post-card";
import postService from "@/services/post.service";
import { userService } from "@/services";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilterValue>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>();
  const observerTarget = useRef(null);

  const fetchPosts = async (resetPage = false) => {
    if ((loading || !hasMore) && !resetPage) return;

    setLoading(true);
    const currentPage = resetPage ? 1 : page;

    try {
      let status = "Published";

      switch (activeFilter) {
        case "all":
          status = "Published";
          break;
        case "my-posts":
          status = "Published|Pending";
          break;
        case "rejected":
          status = "Rejected";
          break;
        default:
          break;
      }

      const response = await postService.searchPost({
        page: currentPage,
        limit: 20,
        status,
        sort_by: "created_at",
        order_by: "desc",
      });

      const result = response.data as any;

      if (result?.result?.posts?.length > 0) {
        if (resetPage) {
          if (
            (activeFilter === "my-posts" || activeFilter === "rejected") &&
            userProfile
          ) {
            setPosts(
              result.result.posts?.filter(
                (post: any) => post.user_id === userProfile._id
              ) || []
            );
          } else {
            setPosts(result.result.posts || []);
          }
        } else {
          if (
            (activeFilter === "my-posts" || activeFilter === "rejected") &&
            userProfile
          ) {
            setPosts((prev: any[]) => {
              const existingIds = new Set(prev.map((post: any) => post._id));
              const newPosts = result.result.posts.filter(
                (post: any) =>
                  !existingIds.has(post._id) && post.user_id === userProfile._id
              );
              return [...prev, ...newPosts];
            });
          } else {
            setPosts((prev: any[]) => {
              const existingIds = new Set(prev.map((post: any) => post._id));
              const newPosts = result.result.posts.filter(
                (post: any) => !existingIds.has(post._id)
              );
              return [...prev, ...newPosts];
            });
          }
        }

        setPage(currentPage + 1);

        if (currentPage >= result.result.total_pages) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        if (resetPage) {
          setPosts([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (resetPage) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        if (response.data) {
          setUserProfile(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    console.log("Filter changed to:", activeFilter);
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(true);
  }, [activeFilter, userProfile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, hasMore]);

  const handleFilterChange = (value: PostFilterValue) => {
    if (value === activeFilter) return;
    setActiveFilter(value);
  };

  const handlePostCreated = () => {
    setIsLoading(true);
    setPage(1);
    fetchPosts(true);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setIsLoading(true);
      setPage(1);
      fetchPosts(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <CreatePostForm
        onPostCreated={handlePostCreated}
        currentUser={userProfile}
      />

      <PostFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post: any) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={userProfile}
              activeFilter={activeFilter}
              onDeletePost={handleDeletePost}
            />
          ))}
          <div ref={observerTarget} className="h-10" />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {activeFilter === "my-posts"
            ? "You haven't created any posts yet."
            : activeFilter === "rejected"
            ? "You don't have any rejected posts."
            : "No posts found."}
        </div>
      )}
    </div>
  );
}
