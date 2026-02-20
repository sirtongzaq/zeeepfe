import { NavLink } from "react-router-dom";
import { MessageCircle, QrCode, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-content ${isActive ? "active" : ""}`}>
            <MessageCircle size={20} />
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