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
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/constants/fake-data";

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      //   toast({
      //     title: "Error",
      //     description: "Post content cannot be empty",
      //     variant: "destructive",
      //   });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = createPost(content);

      //   toast({
      //     title: "Post submitted",
      //     description: "Your post has been submitted for review",
      //   });

      setContent("");

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to create post. Please try again.",
      //     variant: "destructive",
      //   });
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
        <CardContent>
          <Textarea
            placeholder="Share your thoughts, questions, or insights with the medical community..."
            className="min-h-[120px] resize-none mb-4"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          <p className="text-xs text-muted-foreground">
            New posts require admin approval before appearing in the community
            feed.
          </p>
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Submitting..." : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
