import { Link } from "react-router-dom";

export default function ChatListPage() {
  const mockChats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "ไปกินข้าวกันไหม",
      time: "10:24",
      unread: 2,
      type: "user",
    },
    {
      id: 2,
      name: "Dev Team",
      lastMessage: "Deploy production แล้ว 🚀",
      time: "09:50",
      unread: 0,
      type: "group",
    },
    {
      id: 3,
      name: "Jane Smith",
      lastMessage: "โอเค เดี๋ยวส่งให้",
      time: "เมื่อวาน",
      unread: 1,
      type: "user",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto chat-list-container">
      {mockChats.map((chat) => (
        <Link key={chat.id} to={`/chat/${chat.id}`} className="chat-list-item">
          {/* Avatar */}
          <div className="chat-avatar">
            {chat.name.slice(0, 2).toUpperCase()}
          </div>

          {/* Info */}
          <div className="chat-info">
            <div className="chat-name">{chat.name}</div>
            <div className="chat-last">{chat.lastMessage}</div>
          </div>

          {/* Meta */}
          <div className="chat-meta">
            <div>{chat.time}</div>
            {chat.unread > 0 && (
              <div className="chat-unread">{chat.unread}</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
