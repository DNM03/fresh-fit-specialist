import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Heart,
  MoreHorizontal,
  AlertCircle,
  XCircle,
  Edit,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostCardProps {
  post: any;
  currentUser?: any;
  activeFilter?: string;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: any) => void;
  onLikePost?: (postId: string, current_user_react: any) => void;
}

// Character limit for the collapsed content view
const CONTENT_PREVIEW_LIMIT = 300;

export function PostCard({
  post,
  currentUser,
  activeFilter = "all",
  onDeletePost,
  onEditPost,
  onLikePost,
}: PostCardProps) {
  // Add state to track if content is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  // Add state for delete confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Add state to control dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isPending = post.status === "Pending";
  const isRejected = post.status === "Rejected";

  const formattedDate = post.created_at
    ? formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })
    : "";

  const userName = post?.user?.fullName || "Unknown User";
  const userAvatar = post?.user?.avatar;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Check if content should be truncated
  const contentText = post.content || "";
  const shouldTruncate = contentText.length > CONTENT_PREVIEW_LIMIT;
  const displayContent =
    shouldTruncate && !isExpanded
      ? contentText.substring(0, CONTENT_PREVIEW_LIMIT) + "..."
      : contentText;

  // Handle delete confirmation
  const handleDeleteClick = () => {
    // Close dropdown first, then open dialog
    setDropdownOpen(false);
    // Use setTimeout to ensure dropdown is closed before opening dialog
    setTimeout(() => {
      setShowDeleteConfirm(true);
    }, 100);
  };

  const handleConfirmDelete = async () => {
    if (!onDeletePost) return;

    setIsDeleting(true);
    try {
      await onDeletePost(post._id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Add cleanup function for dialog close
  const handleDialogChange = (isOpen: boolean) => {
    setShowDeleteConfirm(isOpen);
    if (!isOpen) {
      // Reset deleting state when dialog is closed
      setIsDeleting(false);
    }
  };

  // Handle edit post click
  const handleEditClick = () => {
    setDropdownOpen(false);
    // Use setTimeout to ensure dropdown is closed before calling edit function
    setTimeout(() => {
      if (onEditPost) {
        onEditPost(post);
      }
    }, 100);
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userAvatar ? "" : getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{userName}</div>
              </div>
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
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
              {activeFilter !== "all" && (
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {post.user_id === currentUser?._id && (
                      <>
                        {isRejected && (
                          <DropdownMenuItem onClick={handleEditClick}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={handleDeleteClick}
                          className="text-red-600 focus:text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {(isRejected || isPending) &&
            post.postFeedBacks &&
            post.postFeedBacks.length > 0 && (
              <div className="mt-2 mb-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="w-full">
                    <h4 className="text-sm font-medium text-red-800">
                      Not approved for the following{" "}
                      {post.postFeedBacks.length > 1 ? "reasons" : "reason"}:
                    </h4>

                    {post.postFeedBacks.map((feedback: any, index: number) => (
                      <div
                        key={index}
                        className={
                          index > 0
                            ? "mt-3 pt-3 border-t border-red-200"
                            : "mt-1"
                        }
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-red-700">
                            {index + 1}. {feedback.comment}
                          </p>
                          {feedback.created_at && (
                            <span className="text-xs text-red-400 ml-2">
                              {formatDistanceToNow(
                                parseISO(feedback.created_at),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          )}
                        </div>
                        {feedback.admin && (
                          <p className="text-xs text-red-500 mt-1">
                            Reviewed by:{" "}
                            {feedback.admin.fullName || "Administrator"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Post Title */}
          {post.title && (
            <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
          )}
        </CardHeader>

        <CardContent className="pb-3">
          {/* Post content with expand/collapse functionality */}
          <div>
            <p className="whitespace-pre-line">{displayContent}</p>

            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-primary hover:text-primary/80"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Read more
                  </>
                )}
              </Button>
            )}
          </div>

          {post.medias && post.medias.length > 0 && (
            <div
              className={`mt-4 ${
                post.medias.length === 1 ? "" : "grid grid-cols-2"
              } gap-2`}
            >
              {post.medias.length === 1 ? (
                <div className="relative overflow-hidden rounded-md">
                  {post.medias[0] &&
                    post.medias[0] !== "" &&
                    post.medias[0].startsWith("http") && (
                      <img
                        src={post.medias[0]}
                        alt={`Post image`}
                        className="w-full max-h-96 object-contain rounded-md"
                        onClick={() => window.open(post.medias[0], "_blank")}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                </div>
              ) : (
                post.medias
                  .filter(
                    (image: string) =>
                      image && image !== "" && image.startsWith("http")
                  )
                  .map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-md ${
                        index >= 4 && post.medias.length > 4
                          ? "hidden md:block"
                          : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="rounded-md object-cover w-full aspect-square"
                        onClick={() => window.open(image, "_blank")}
                        style={{ cursor: "pointer" }}
                      />
                      {index === 3 && post.medias.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-lg font-medium">
                            +{post.medias.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t pt-3 flex justify-between">
          <div className="flex space-x-4">
            <button
              className={`flex items-center gap-1 hover:cursor-pointer ${
                post.reactions.current_user_react ? "text-red-500" : ""
              }`}
              onClick={() => {
                if (onLikePost) {
                  onLikePost(post._id, post.reactions.current_user_react);
                }
              }}
              disabled={post.status !== "Published"}
            >
              <Heart
                className={`h-4 w-4 ${
                  post.reactions.current_user_react ? "fill-current" : ""
                }`}
              />
              <span>{post.reactions ? post.reactions.Like : ""}</span>
            </button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog is rendered completely separate from the dropdown to avoid interaction issues */}
      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Post Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 border border-red-100 bg-red-50 rounded-md">
              <p className="text-sm font-medium text-red-900 mb-1">
                Post Details:
              </p>
              <p className="text-sm text-red-800">
                {post.title ? `"${post.title}"` : "Untitled post"}
              </p>
              <p className="text-xs text-red-700 mt-2">
                {post.content
                  ? `${post.content.substring(0, 80)}${
                      post.content.length > 80 ? "..." : ""
                    }`
                  : ""}
              </p>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
