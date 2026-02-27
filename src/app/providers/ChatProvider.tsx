import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { chatApi } from "@/features/chat/api/api";

export default function ChatProvider() {
  const setRooms = useChatStore((s) => s.setRooms);

  useEffect(() => {
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

      setRooms(mapped);
    };

    load();
  }, [setRooms]);

  return null;
}
