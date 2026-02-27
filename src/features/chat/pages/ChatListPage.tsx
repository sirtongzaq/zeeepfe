import { Link } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import { loadName } from "../utils/chat.utils";

export default function ChatListPage() {
  const rooms = useChatStore((s) => s.rooms);

  ////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////

  if (!rooms.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">No rooms</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto chat-list-container">
      {rooms.map((room) => (
        <Link key={room.id} to={`/chat/${room.id}`} className="chat-list-item">
          <div className="chat-avatar">{loadName(room, true)}</div>

          <div className="chat-info">
            <div className="chat-name">{loadName(room)}</div>
            <div className="chat-last">{room.lastMessage?.content}</div>
          </div>

          <div className="chat-meta">
            <div>
              {room.lastMessage?.createdAt
                ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>

            {room.unreadCount && room.unreadCount > 0 && (
              <div className="chat-unread">{room.unreadCount}</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
