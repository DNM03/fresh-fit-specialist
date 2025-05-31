export interface Post {
  _id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  content: string;
  image: string | null;
  likes: number;
  isLiked: boolean;
  isFollowing: boolean;
  isSaved: boolean;
  createdAt: string;
  status: "published" | "pending";
}

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
