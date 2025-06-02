import { formatDistanceToNow, parseISO } from "date-fns";
import { Heart, MoreHorizontal, AlertCircle, XCircle } from "lucide-react";
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

interface PostCardProps {
  post: any;
  currentUser?: any;
  activeFilter?: string;
  onDeletePost?: (postId: string) => void;
}

export function PostCard({
  post,
  currentUser,
  activeFilter = "all",
  onDeletePost,
}: PostCardProps) {
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

  return (
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {post.user_id === currentUser?._id && (
                    <DropdownMenuItem onClick={() => onDeletePost?.(post._id)}>
                      Delete Post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {isRejected && post.postFeedBacks && post.postFeedBacks.length > 0 && (
          <div className="mt-2 mb-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Not approved for the following reason:
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {post.postFeedBacks[0].comment}
                </p>
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
        <p className="whitespace-pre-line">{post.content}</p>

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
          <div className={`flex items-center gap-1 text-red-500`}>
            <Heart className={`h-4 w-4 fill-current`} />
            <span>{post.reactions ? post.reactions.Like : ""}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
