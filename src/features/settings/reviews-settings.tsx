import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Star, Search } from "lucide-react";

// Mock data for reviews
const initialReviews = [
  {
    id: "rev-1",
    userId: "user-1",
    userName: "John Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "Dr. Morgan is an exceptional cardiologist. He took the time to explain my condition in detail and answered all my questions. His expertise and bedside manner are outstanding.",
    createdAt: new Date("2023-11-15"),
  },
  {
    id: "rev-2",
    userId: "user-2",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    content:
      "Very knowledgeable doctor who provided excellent care. The only reason for 4 stars instead of 5 is the wait time was a bit long.",
    createdAt: new Date("2023-10-22"),
  },
  {
    id: "rev-3",
    userId: "user-3",
    userName: "Michael Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "Dr. Morgan saved my life. His quick diagnosis and immediate action prevented what could have been a major cardiac event. I cannot recommend him highly enough.",
    createdAt: new Date("2023-09-05"),
  },
  {
    id: "rev-4",
    userId: "user-4",
    userName: "Emily Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 3,
    content:
      "Good doctor with solid knowledge. However, I felt rushed during my appointment and would have appreciated more time to discuss my concerns.",
    createdAt: new Date("2023-08-17"),
  },
  {
    id: "rev-5",
    userId: "user-5",
    userName: "David Wilson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "Excellent physician who truly cares about his patients. Dr. Morgan followed up personally after my procedure to check on my recovery.",
    createdAt: new Date("2023-07-29"),
  },
];

export function ReviewsSettings() {
  const [reviews] = useState(initialReviews);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Filter reviews based on rating and search term
  const filteredReviews = reviews.filter((review) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "positive" && review.rating >= 4) ||
      (filter === "neutral" && review.rating === 3) ||
      (filter === "negative" && review.rating <= 2);

    const matchesSearch =
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Count reviews by rating
  const ratingCounts = {
    positive: reviews.filter((r) => r.rating >= 4).length,
    neutral: reviews.filter((r) => r.rating === 3).length,
    negative: reviews.filter((r) => r.rating <= 2).length,
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Patient Reviews</h3>
          <p className="text-sm text-muted-foreground">
            View and manage reviews from your patients.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Average Rating</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-3xl font-bold mr-2">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {renderStars(Math.round(averageRating))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {reviews.length} reviews
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">Rating Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(5)}</div>
                    <span className="text-sm">Positive</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {ratingCounts.positive}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(3)}</div>
                    <span className="text-sm">Neutral</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    {ratingCounts.neutral}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(1)}</div>
                    <span className="text-sm">Negative</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    {ratingCounts.negative}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="positive">Positive (4-5 ★)</SelectItem>
                <SelectItem value="neutral">Neutral (3 ★)</SelectItem>
                <SelectItem value="negative">Negative (1-2 ★)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-2/3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found matching your filters.
            </div>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage
                            src={review.userAvatar || "/placeholder.svg"}
                            alt={review.userName}
                          />
                          <AvatarFallback>
                            {review.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>

                    <p className="text-sm">{review.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
