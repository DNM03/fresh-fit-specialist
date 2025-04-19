export type PostType = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorSpecialty: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "approved" | "rejected";
  likes: number;
  likedByUser: boolean;
  savedByUser: boolean;
  comments: number;
};

export type PostLikeType = {
  postId: string;
  userId: string;
  createdAt: Date;
};

export type PostSaveType = {
  postId: string;
  userId: string;
  createdAt: Date;
};

export type CommentType = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorSpecialty: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
};
