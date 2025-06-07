import type React from "react";

import { useState, useEffect } from "react";
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
import ImageDropzone, { ImageFile } from "@/components/ui/image-dropzone";
import { ImageIcon } from "lucide-react";
import mediaService from "@/services/media.service";

interface CreatePostFormProps {
  onPostCreated?: () => void;
  currentUser?: any;
  editPost?: any; // Add post to edit
  onCancelEdit?: () => void; // Add callback for canceling edit
}

export function CreatePostForm({
  onPostCreated,
  currentUser,
  editPost,
  onCancelEdit,
}: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<ImageFile[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Initialize the form with existing post data when editing
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || "");
      setContent(editPost.content || "");

      // Check if the post has a media image
      if (editPost.medias && editPost.medias.length > 0 && editPost.medias[0]) {
        setExistingImageUrl(editPost.medias[0]);
      }
    }
  }, [editPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Error", {
        description: "Post content cannot be empty",
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = existingImageUrl || "";

      if (image[0]?.file) {
        const imageRes = await mediaService.backupUploadImage(image[0]?.file);
        if (imageRes?.result?.url) {
          imageUrl = imageRes.result.url;
        }
      }

      if (editPost) {
        await postService.updatePost(editPost._id, {
          title: title.trim(),
          content: content.trim(),
          ...(imageUrl ? { medias: [imageUrl] } : {}),
        });

        toast.success("Success", {
          description: "Your post has been updated",
          style: {
            background: "#3ac76b",
            color: "#fff",
          },
        });

        if (onCancelEdit) {
          onCancelEdit();
        }
      } else {
        // Create new post
        await postService.createPost({
          title: title.trim(),
          content: content.trim(),
          type: "Expert_Post",
          user_id: currentUser?._id || "",
          medias: imageUrl ? [imageUrl] : [""],
          mediaType: "Image",
          tags: ["Other"],
        });

        toast.success("Success", {
          description: "Your post has been submitted for review",
          style: {
            background: "#3ac76b",
            color: "#fff",
          },
        });
      }

      // Reset form
      setTitle("");
      setContent("");
      setImage([]);
      setExistingImageUrl(null);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error(
        editPost ? "Error updating post:" : "Error creating post:",
        error
      );
      toast.error("Error", {
        description: editPost
          ? "Failed to update post. Please try again."
          : "Failed to create post. Please try again.",
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>
          {editPost ? "Edit Rejected Post" : "Create a Post"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pb-4">
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
          <div className="space-y-2">
            <Label>Post Image</Label>
            {existingImageUrl && !image.length ? (
              <div className="mb-2">
                <div className="relative">
                  <img
                    src={existingImageUrl}
                    alt="Current post image"
                    className="max-h-64 rounded-md object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    type="button"
                    onClick={() => setExistingImageUrl(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <ImageDropzone
                maxImages={1}
                maxSizeInMB={20}
                onImagesChange={(value) => {
                  setImage(value);
                  if (value.length) {
                    setExistingImageUrl(null);
                  }
                }}
                icon={<ImageIcon className="h-16 w-16 text-gray-300 mb-4" />}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          {editPost ? (
            <>
              <p className="text-xs text-muted-foreground">
                Your edited post will be submitted for review again.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={onCancelEdit}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !content.trim() || !title.trim()}
                >
                  {isSubmitting ? "Submitting..." : "Resubmit Post"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                New posts require admin approval before appearing in the
                community feed.
              </p>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim() || !title.trim()}
              >
                {isSubmitting ? "Submitting..." : "Post"}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
