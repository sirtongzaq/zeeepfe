import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTheme } from "../theme/useTheme";
import logoLight from "@/assets/logo_light_lg.png";
import logoDark from "@/assets/logo_dark_lg.png";

type Props = {
  isChatPage?: boolean;
};

export default function Header({ isChatPage }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const mockUsers: Record<string, string> = {
    "1": "สมชาย",
    "2": "Jane",
  };

  const chatName = id ? mockUsers[id] : "";
  const isOnline = chatName ? true : false; // mock

  if (isChatPage) {
    return (
      <header className="app-header chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="chat-header-info">
          <div className="chat-avatar">
            {chatName ? chatName.slice(0, 2) : "NF"}
          </div>
          <div>
            <div className="chat-name">{chatName ? chatName : "Not Found"}</div>
            <div className="chat-status-wrapper">
              <span
                className={`status-dot ${isOnline ? "online" : "offline"}`}
              />
              <span className="chat-status">
                {isOnline ? "ออนไลน์" : "ออฟไลน์"}
              </span>
            </div>
          </div>
        </div>

        <div className="header-spacer" />
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <img
          src={theme === "dark" ? logoLight : logoDark}
          alt="Zeeep logo"
          className="header-logo"
        />
      </div>

      <ThemeToggle />
    </header>
  );
}
