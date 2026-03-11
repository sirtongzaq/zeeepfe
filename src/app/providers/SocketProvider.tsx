import { useAuthStore } from "@/stores/authStore";
import { socket } from "@/shared/lib/socket";
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import type { ChatRoom, Message } from "@/features/chat/types/chat.types";

export function SocketProvider() {
  const token = useAuthStore((s) => s.accessToken);
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!token || !currentUser) {
      socket.disconnect();
      return;
    }

    socket.auth = { token: `Bearer ${token}` };

    if (!socket.connected) {
      socket.connect();
    }

    //////////////////////////////////////////////////////
    // room_updated
    //////////////////////////////////////////////////////

    const handleRoomUpdated = (data: {
      chatRoomId: string;
      lastMessage: Message;
      lastMessageAt: Date;
      senderId: string;
    }) => {
      useChatStore.getState().updateRoom(
        {
          chatRoomId: data.chatRoomId,
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt,
          senderId: data.senderId,
        },
        currentUser.id,
        useChatStore.getState().activeRoomId === data.chatRoomId,
      );
    };

    //////////////////////////////////////////////////////
    // room_created
    //////////////////////////////////////////////////////

    const handleRoomCreated = (room: ChatRoom) => {
      const rooms = useChatStore.getState().rooms;

      const exists = rooms.find((r) => r.id === room.id);
      if (exists) return;

      useChatStore.getState().addRoom(room);
    };

    socket.on("room_updated", handleRoomUpdated);
    socket.on("room_created", handleRoomCreated);

    return () => {
      socket.off("room_updated", handleRoomUpdated);
      socket.off("room_created", handleRoomCreated);
    };
  }, [token, currentUser]);

  return null;
}
