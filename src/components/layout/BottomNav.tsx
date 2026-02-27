import { NavLink } from "react-router-dom";
import { MessageCircle, QrCode, User } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";

export default function BottomNav() {
  ////////////////////////////////////////////////
  // Unread Count
  ////////////////////////////////////////////////

  const totalUnread = useChatStore((s) =>
    s.rooms.reduce((sum, room) => sum + (room.unreadCount ?? 0), 0),
  );
  const displayCount =
    totalUnread > 99 ? "99+" : totalUnread > 0 ? totalUnread : null;

  ////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-content ${isActive ? "active" : ""}`}>
            <div className="nav-icon-wrapper">
              <MessageCircle size={20} />
              {displayCount && (
                <span className="nav-badge">{displayCount}</span>
              )}
            </div>
            <span>Chat</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/qr" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-content ${isActive ? "active" : ""}`}>
            <QrCode size={20} />
            <span>QR</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/profile" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-content ${isActive ? "active" : ""}`}>
            <User size={20} />
            <span>Profile</span>
          </div>
        )}
      </NavLink>
    </nav>
  );
}
