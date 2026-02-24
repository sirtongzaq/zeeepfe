import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { ChatMessage, ChatRoom } from "./types/chat.types";

export const chatApi = {
  getMyRooms: () => api.get<ApiResponse<ChatRoom[]>>("/chat/rooms"),

  getMessages: (chatRoomId: string) =>
    api.get<ApiResponse<ChatMessage>>(`/chat/rooms/${chatRoomId}/messages`),

  getOrCreatePrivateRoom: (friendId: string) =>
    api.post<ApiResponse<{ id: string }>>("/chat/rooms/private", {
      friendId,
    }),

  getRoomDetail: (chatRoomId: string) =>
    api.get<ApiResponse<never>>(`/chat/rooms/${chatRoomId}`),
};
