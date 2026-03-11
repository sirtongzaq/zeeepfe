import { create } from "zustand";
import type {
  ChatRoom,
  RoomUpdatedPayload,
} from "@/features/chat/types/chat.types";

interface ChatState {
  rooms: ChatRoom[];
  totalUnread: number;
  activeRoomId: string | null;

  clearRooms: () => void;

  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;

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

  //////////////////////////////////////////////////////
  /// clear rooms (logout)
  //////////////////////////////////////////////////////

  clearRooms: () =>
    set({
      rooms: [],
      totalUnread: 0,
      activeRoomId: null,
    }),

  //////////////////////////////////////////////////////
  // active room
  //////////////////////////////////////////////////////

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  //////////////////////////////////////////////////////
  // set rooms (API initial load)
  //////////////////////////////////////////////////////

  setRooms: (rooms) =>
    set((state) => {
      // merge rooms ป้องกัน socket overwrite
      const merged = [
        ...rooms,
        ...state.rooms.filter((r) => !rooms.some((n) => n.id === r.id)),
      ];

      merged.sort((a, b) => {
        const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;

        return bTime - aTime;
      });

      return {
        rooms: merged,
        totalUnread: merged.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
      };
    }),

  //////////////////////////////////////////////////////
  // add room (socket room_created)
  //////////////////////////////////////////////////////

  addRoom: (room) =>
    set((state) => {
      if (state.rooms.some((r) => r.id === room.id)) return state;

      const updated = [room, ...state.rooms];

      return {
        rooms: updated,
        totalUnread: updated.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
      };
    }),

  //////////////////////////////////////////////////////
  // update room (socket room_updated)
  //////////////////////////////////////////////////////

  updateRoom: (data, myUserId, isActiveRoom = false) =>
    set((state) => {
      const index = state.rooms.findIndex((r) => r.id === data.chatRoomId);

      const rooms = [...state.rooms];

      const newUnread = data.senderId === myUserId || isActiveRoom ? 0 : 1;

      //////////////////////////////////////////////////////
      // room not exist
      //////////////////////////////////////////////////////

      if (index === -1) {
        rooms.unshift({
          id: data.chatRoomId,
          isGroup: data.isGroup ?? false,
          name: data.name ?? null,
          otherUser: data.otherUser ?? null,
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt,
          unreadCount: newUnread,
        } as unknown as ChatRoom);
      }

      //////////////////////////////////////////////////////
      // room exist
      //////////////////////////////////////////////////////
      else {
        const room = rooms.splice(index, 1)[0];

        const updatedRoom: ChatRoom = {
          ...room,
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt,
          unreadCount:
            data.senderId === myUserId || isActiveRoom
              ? 0
              : (room.unreadCount ?? 0) + 1,
        };

        // move room ขึ้นบนสุด (O1)
        rooms.unshift(updatedRoom);
      }

      return {
        rooms,
        totalUnread: rooms.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0),
      };
    }),

  //////////////////////////////////////////////////////
  // reset unread
  //////////////////////////////////////////////////////

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
