import { useState } from "react";
import { Filter, Clock, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PostFilterValue = "all" | "my-posts" | "saved";
export type SortValue = "recent" | "popular";

interface PostFiltersProps {
  activeFilter: PostFilterValue;
  onFilterChange: (value: PostFilterValue) => void;
  onSortChange: (value: SortValue) => void;
}

export function PostFilters({
  activeFilter,
  onFilterChange,
  onSortChange,
}: PostFiltersProps) {
  const [sortBy, setSortBy] = useState<SortValue>("recent");

  const handleSortChange = (value: SortValue) => {
    setSortBy(value);
    onSortChange(value);
  };

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
          <TabsTrigger value="saved" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Sort: {sortBy === "recent" ? "Recent" : "Popular"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => handleSortChange(value as SortValue)}
          >
            <DropdownMenuRadioItem value="recent">
              Most Recent
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">
              Most Popular
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
