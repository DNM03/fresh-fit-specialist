import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageSquare,
  Bookmark,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import type { PostType } from "@/constants/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleLike, toggleSave } from "@/constants/fake-data";

interface PostCardProps {
  post: PostType;
  onLikeToggle?: (postId: string) => void;
  onSaveToggle?: (postId: string) => void;
}

export function PostCard({ post, onLikeToggle, onSaveToggle }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.savedByUser);

  const handleLikeToggle = () => {
    toggleLike(post.id);
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    if (onLikeToggle) onLikeToggle(post.id);
  };

  const handleSaveToggle = () => {
    toggleSave(post.id);
    setSaved(!saved);
    if (onSaveToggle) onSaveToggle(post.id);
  };

  const isPending = post.status === "pending";
  const isRejected = post.status === "rejected";

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3 pt-4 flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={post.authorAvatar || "/placeholder.svg"}
            alt={post.authorName}
          />
          <AvatarFallback>{post.authorName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{post.authorName}</p>
              <p className="text-sm text-muted-foreground">
                {post.authorSpecialty}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isPending && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="text-amber-500 border-amber-500"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending Approval
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This post is waiting for admin approval</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isRejected && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="text-red-500 border-red-500"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Approved
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This post was not approved by admins</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report Post</DropdownMenuItem>
                  {post.authorId === "current-user" && (
                    <DropdownMenuItem>Delete Post</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="whitespace-pre-line">{post.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
            onClick={handleLikeToggle}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span>{likeCount > 0 ? likeCount : ""}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments > 0 ? post.comments : ""}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${saved ? "text-primary" : ""}`}
          onClick={handleSaveToggle}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
}
