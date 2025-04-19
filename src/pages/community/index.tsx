import { useState, useEffect } from "react";

import type { PostType } from "@/constants/types";
import {
  PostFilters,
  PostFilterValue,
  SortValue,
} from "@/features/community/post-filter";
import {
  getAllPosts,
  getCurrentUserPosts,
  getSavedPosts,
} from "@/constants/fake-data";
import { CreatePostForm } from "@/features/community/create-post-form";
import { PostCard } from "@/features/community/post-card";

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [activeFilter, setActiveFilter] = useState<PostFilterValue>("all");
  const [sortBy, setSortBy] = useState<SortValue>("recent");
  const [isLoading, setIsLoading] = useState(true);

  // Load posts based on active filter
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let filteredPosts: PostType[];

      switch (activeFilter) {
        case "my-posts":
          filteredPosts = getCurrentUserPosts();
          break;
        case "saved":
          filteredPosts = getSavedPosts();
          break;
        case "all":
        default:
          filteredPosts = getAllPosts();
          break;
      }

      // Sort posts
      if (sortBy === "popular") {
        filteredPosts = [...filteredPosts].sort((a, b) => b.likes - a.likes);
      } else {
        filteredPosts = [...filteredPosts].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      }

      setPosts(filteredPosts);
      setIsLoading(false);
    }, 500);
  }, [activeFilter, sortBy]);

  const handleFilterChange = (value: PostFilterValue) => {
    setActiveFilter(value);
  };

  const handleSortChange = (value: SortValue) => {
    setSortBy(value);
  };

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    if (activeFilter === "all" || activeFilter === "my-posts") {
      const updatedPosts =
        activeFilter === "all" ? getAllPosts() : getCurrentUserPosts();
      setPosts(
        updatedPosts.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    }
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <CreatePostForm onPostCreated={handlePostCreated} />

      <PostFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {activeFilter === "my-posts"
            ? "You haven't created any posts yet."
            : activeFilter === "saved"
            ? "You haven't saved any posts yet."
            : "No posts found."}
        </div>
      )}
    </div>
  );
}
