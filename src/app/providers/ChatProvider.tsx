import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { chatApi } from "@/features/chat/api/api";
import { useAuthStore } from "@/stores/authStore";

export default function ChatProvider() {
  const setRooms = useChatStore((s) => s.setRooms);
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const res = await chatApi.getMyRooms();
      const rooms = res.data.data;

      const mapped = rooms.map((r) => ({
        ...r,
        lastMessageAt: r.lastMessage
          ? new Date(r.lastMessage.createdAt)
          : undefined,
      }));

      mapped.sort((a, b) => {
        const aTime = a.lastMessageAt?.getTime() ?? 0;
        const bTime = b.lastMessageAt?.getTime() ?? 0;
        return bTime - aTime;
      });

      const currentRooms = useChatStore.getState().rooms;

      const merged = [
        ...mapped,
        ...currentRooms.filter((r) => !mapped.find((m) => m.id === r.id)),
      ];

      setRooms(merged);
    };

    load();
  }, [setRooms, userId]);

  return null;
}
