import { AxiosResponse } from "axios";
import apiService from "./api.service";

class ChatService {
  createChatRoom(): Promise<AxiosResponse> {
    return apiService.post("/chats/chat-room");
  }
  sendMessage(
    chatRoomId: string,
    message: string,
    image?: string
  ): Promise<AxiosResponse> {
    return apiService.post(`/chats/${chatRoomId}/message`, { message, image });
  }
  deleteChatRoom(chatRoomId: string): Promise<AxiosResponse> {
    return apiService.delete(`/chats/${chatRoomId}`);
  }
  getAllChatRoomsOfUser(page?: number, limit?: number): Promise<AxiosResponse> {
    return apiService.get(`/chats?limit=${limit}&page=${page}`);
  }
  getMessagesOfChatRoom(
    chatRoomId: string,
    page?: number,
    limit?: number
  ): Promise<AxiosResponse> {
    return apiService.get(
      `/chats/${chatRoomId}/messages?limit=${limit}&page=${page}`
    );
  }
}

const chatService = new ChatService();
export default chatService;
