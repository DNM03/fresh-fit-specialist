import { Post } from "@/constants/types";

export interface CreatePostData {
  user_id: string;
  type: string;
  title: string;
  content?: string;
  medias?: string[];
  mediaType?: string;
  tags?: string[];
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export type PostPaginatedResponse = PaginatedResponse<Post>;
