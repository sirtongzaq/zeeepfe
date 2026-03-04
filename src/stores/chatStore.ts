import { create } from "zustand";
import type {
  ChatRoom,
  RoomUpdatedPayload,
} from "@/features/chat/types/chat.types";

interface ChatState {
  rooms: ChatRoom[];
  totalUnread: number;
  activeRoomId: string | null;

  setRooms: (rooms: ChatRoom[]) => void;
  updateRoom: (
    payload: RoomUpdatedPayload,
    myUserId: string,
    isActiveRoom?: boolean,
  ) => void;
  resetRoomUnread: (roomId: string) => void;
  setActiveRoom: (roomId: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  totalUnread: 0,
  activeRoomId: null,

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  setRooms: (rooms) =>
    set({
      rooms,
      totalUnread: rooms.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
    }),

  updateRoom: (data, myUserId, isActiveRoom = false) =>
    set((state) => {
      const updated = state.rooms.map((room) =>
        room.id === data.chatRoomId
          ? {
              ...room,
              lastMessage: data.lastMessage,
              lastMessageAt: data.lastMessageAt,
              unreadCount:
                data.senderId === myUserId || isActiveRoom
                  ? 0
                  : (room.unreadCount ?? 0) + 1,
            }
          : room,
      );

      // 🔥 reorder ห้องตาม lastMessageAt
      updated.sort((a, b) => {
        const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;

        return bTime - aTime;
      });

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
