import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chatApi } from "@/features/chat/api";
import type { ChatRoom } from "./types/chat.types";
import { loadName } from "./utils/chat.utils";

export default function ChatListPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    async function loadRooms() {
      const res = await chatApi.getMyRooms();
      setRooms(res.data.data);
      console.log("📦 Loaded chat rooms", res.data.data);
    }

    loadRooms();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto chat-list-container">
      {rooms && rooms.length > 0 ? (
        rooms.map((room) => (
          <Link
            key={room.id}
            to={`/chat/${room.id}`}
            className="chat-list-item"
          >
            {/* Avatar */}
            <div className="chat-avatar">{loadName(room, true)}</div>

            {/* Info */}
            <div className="chat-info">
              <div className="chat-name">{loadName(room)}</div>
              <div className="chat-last">
                {room.lastMessage?.content || "No messages yet"}
              </div>
            </div>

            {/* Meta */}
            <div className="chat-meta">
              <div>
                {room.lastMessage?.createdAt
                  ? new Date(room.lastMessage.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : ""}
              </div>

              {room.unreadCount && room.unreadCount > 0 && (
                <div className="chat-unread">{room.unreadCount}</div>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">No rooms</div>
      )}
    </div>
  );
}
