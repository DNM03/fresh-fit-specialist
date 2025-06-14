import { useState, useEffect, useRef } from "react";

import { PostFilters, PostFilterValue } from "@/features/community/post-filter";
import { CreatePostForm } from "@/features/community/create-post-form";
import { PostCard } from "@/features/community/post-card";
import postService from "@/services/post.service";
import { userService } from "@/services";
import { ArrowUp, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilterValue>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>();
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const observerTarget = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchPosts = async (resetPage = false, searchTerm = searchQuery) => {
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
        case "pending":
          status = "Pending";
          break;
        case "rejected":
          status = "Rejected";
          break;
        default:
          break;
      }

      // Add search term to API call
      const response = await postService.searchPost({
        page: currentPage,
        limit: 20,
        status,
        sort_by: "created_at",
        order_by: "desc",
        search: searchTerm || undefined, // Only include if there's a search term
      });

      const result = response.data as any;

      if (result?.result?.posts?.length > 0) {
        if (resetPage) {
          if (
            (activeFilter === "my-posts" ||
              activeFilter === "rejected" ||
              activeFilter === "pending") &&
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
            (activeFilter === "my-posts" ||
              activeFilter === "rejected" ||
              activeFilter === "pending") &&
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
      setIsSearching(false);
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
    fetchPosts(true, searchQuery);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(true, searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(true, "");
  };

  const handlePostCreated = () => {
    setEditingPost(null);
    setIsLoading(true);
    setPage(1);
    fetchPosts(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handlePostUpdated = () => {
    setEditingPost(null);
    setIsLoading(true);
    setPage(1);
    fetchPosts(true);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      toast.success("Post deleted successfully", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      setIsLoading(true);
      setPage(1);
      fetchPosts(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      {/* Show either edit form or create form */}
      {editingPost ? (
        <CreatePostForm
          onPostCreated={handlePostUpdated}
          currentUser={userProfile}
          editPost={editingPost}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <CreatePostForm
          onPostCreated={handlePostCreated}
          currentUser={userProfile}
        />
      )}

      {/* Search Bar */}
      <Card className="mb-5">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search posts by title..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <PostFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length > 0 ? (
        <div>
          {searchQuery && (
            <p className="text-muted-foreground mb-4">
              Found {posts.length} results for "{searchQuery}"
            </p>
          )}
          {posts.map((post: any) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={userProfile}
              activeFilter={activeFilter}
              onDeletePost={handleDeletePost}
              onEditPost={handleEditPost}
            />
          ))}
          <div ref={observerTarget} className="h-10" />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery
            ? `No posts found matching "${searchQuery}".`
            : activeFilter === "my-posts"
            ? "You haven't created any published posts yet."
            : activeFilter === "pending"
            ? "You don't have any pending posts awaiting review."
            : activeFilter === "rejected"
            ? "You don't have any rejected posts."
            : "No posts found."}
        </div>
      )}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600"
      >
        <ArrowUp className="h-8 w-8" />
      </button>
    </div>
  );
}
