import { create } from "zustand";
import type {
  ChatRoom,
  RoomUpdatedPayload,
} from "@/features/chat/types/chat.types";

interface ChatState {
  rooms: ChatRoom[];
  totalUnread: number;

  setRooms: (rooms: ChatRoom[]) => void;
  updateRoom: (payload: RoomUpdatedPayload, myUserId: string) => void;
  resetRoomUnread: (roomId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  totalUnread: 0,

  setRooms: (rooms) =>
    set({
      rooms,
      totalUnread: rooms.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
    }),

  updateRoom: (data, myUserId) =>
    set((state) => {
      const updated = state.rooms.map((room) =>
        room.id === data.chatRoomId
          ? {
              ...room,
              lastMessage: data.lastMessage,
              unreadCount:
                data.senderId === myUserId
                  ? (room.unreadCount ?? 0)
                  : (room.unreadCount ?? 0) + 1,
            }
          : room,
      );

      return {
        rooms: updated,
        totalUnread: updated.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
      };
    }),

  resetRoomUnread: (roomId) =>
    set((state) => {
      const updated = state.rooms.map((room) =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room,
      );

      return {
        rooms: updated,
        totalUnread: updated.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
      };
    }),
}));
