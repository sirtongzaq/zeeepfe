import { useAuthStore } from "@/stores/authStore";
import { socket } from "@/shared/lib/socket";
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import type { Message } from "@/features/chat/types/chat.types";

export function SocketManager() {
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
    // 🔥 Sidebar update only
    //////////////////////////////////////////////////////
    const handleRoomUpdated = (data: {
      chatRoomId: string;
      lastMessage: Message;
      senderId: string;
    }) => {
      useChatStore.getState().updateRoom(
        {
          chatRoomId: data.chatRoomId,
          lastMessage: data.lastMessage,
          senderId: data.senderId,
        },
        currentUser.id,
      );
    };

    socket.on("room_updated", handleRoomUpdated);

    return () => {
      socket.off("room_updated", handleRoomUpdated);
    };
  }, [token, currentUser]);

  return null;
}
