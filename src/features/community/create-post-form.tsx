import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import postService from "@/services/post.service";

interface CreatePostFormProps {
  onPostCreated?: () => void;
  currentUser?: any;
}

export function CreatePostForm({
  onPostCreated,
  currentUser,
}: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast("Error", {
        description: "Post content cannot be empty",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await postService.createPost({
        title: title.trim(),
        content: content.trim(),
        type: "Expert_Post",
        user_id: currentUser?._id || "",
        medias: [""],
        mediaType: "Image",
        tags: ["Other"],
      });

      toast("Success", {
        description: "Your post has been submitted for review",
      });

      setTitle("");
      setContent("");

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast("Error", {
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="Add a title to your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="Share your thoughts, questions, or insights with the community..."
              className="min-h-[120px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          <p className="text-xs text-muted-foreground">
            New posts require admin approval before appearing in the community
            feed.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim() || !title.trim()}
          >
            {isSubmitting ? "Submitting..." : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
