import { PostPaginatedResponse } from "@/types/post.type";
import { AxiosResponse } from "axios";
import apiService from "./api.service";

class PostService {
  createPost(post: any): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>("/posts/create", post);
  }
  searchPost({
    page = 1,
    limit = 10,
    type = "",
    status = "",
    sort_by = "created_at",
    order_by = "desc",
  }: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    sort_by?: string;
    order_by?: string;
  }): Promise<AxiosResponse<PostPaginatedResponse>> {
    return apiService.get<PostPaginatedResponse>(
      `/posts?page=${page}&limit=${limit}${type ? `&type=${type}` : ""}${
        status ? `&status=${status}` : ""
      }${sort_by ? `&sort_by=${sort_by}` : ""}${
        order_by ? `&order_by=${order_by}` : ""
      }`
    );
  }
  getPostById(id: string): Promise<AxiosResponse> {
    return apiService.get<AxiosResponse>(`/posts/${id}`);
  }
  bookmarkPost(id: string): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>(`/bookmarks/${id}`);
  }
  unbookmarkPost(id: string): Promise<AxiosResponse> {
    return apiService.delete<AxiosResponse>(`/bookmarks/${id}`);
  }
  getBookmarkedPosts({
    page,
    limit,
    sort_by,
    order_by,
  }: {
    page?: number;
    limit?: number;
    sort_by?: string;
    order_by?: string;
  }): Promise<AxiosResponse> {
    return apiService.get(
      `/bookmarks?page=${page}&limit=${limit}&sort_by=${sort_by}&order_by=${order_by}`
    );
  }
  reactPost(
    id: string,
    userId?: string,
    reaction?: string
  ): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>(`/posts/${id}/reactions`, {
      user_id: userId,
      reaction,
    });
  }
  getReactionsCount(id: string): Promise<AxiosResponse> {
    return apiService.get<AxiosResponse>(`/posts/${id}/reactions`);
  }
  deleteReaction(id: string, reactionId: string): Promise<AxiosResponse> {
    return apiService.delete<AxiosResponse>(
      `/posts/${id}/reactions/${reactionId}`
    );
  }
  deletePost(id: string): Promise<AxiosResponse> {
    return apiService.delete<AxiosResponse>(`/posts/${id}`);
  }
}

const postService = new PostService();
export default postService;
