import { formatDistanceToNow, parseISO } from "date-fns";
import { Heart, MoreHorizontal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface PostCardProps {
  post: any;
  currentUser?: any;
  activeFilter?: string;
  onDeletePost?: (postId: string) => void;
}

export function PostCard({
  post,
  // onLikeToggle,
  // onSaveToggle,
  currentUser,
  activeFilter = "all",
  onDeletePost,
}: PostCardProps) {
  // const [liked, setLiked] = useState(post.likedByUser);
  // const [likeCount, setLikeCount] = useState(post.likes);
  // const [saved, setSaved] = useState(post.savedByUser);

  // const handleLikeToggle = () => {
  //   setLiked(!liked);
  //   setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  //   if (onLikeToggle) onLikeToggle(post._id);
  // };

  // const handleSaveToggle = () => {
  //   setSaved(!saved);
  //   if (onSaveToggle) onSaveToggle(post._id);
  // };

  const isPending = post.status === "Pending";
  const isRejected = post.status === "Rejected";

  const formattedDate = post.created_at
    ? formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })
    : "";

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div></div>
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
        {/* Post Title */}
        {post.title && (
          <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        {/* Post Content */}
        <p className="whitespace-pre-line">{post.content}</p>

        {/* Post Images (if any) */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="rounded-md object-cover w-full max-h-64"
              />
            ))}
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
        {/* <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${saved ? "text-primary" : ""}`}
          onClick={handleSaveToggle}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </Button> */}
      </CardFooter>
    </Card>
  );
}
