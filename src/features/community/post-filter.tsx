import { Clock, Bookmark, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type PostFilterValue = "all" | "my-posts" | "rejected";

interface PostFiltersProps {
  activeFilter: PostFilterValue;
  onFilterChange: (value: PostFilterValue) => void;
}

export function PostFilters({
  activeFilter,
  onFilterChange,
}: PostFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Tabs
        defaultValue={activeFilter}
        onValueChange={(value) => onFilterChange(value as PostFilterValue)}
      >
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">All Posts</span>
          </TabsTrigger>
          <TabsTrigger value="my-posts" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">My Posts</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Rejected</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
