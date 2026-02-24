import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTheme } from "../theme/useTheme";
import logoLight from "@/assets/logo_light_lg.png";
import logoDark from "@/assets/logo_dark_lg.png";
import LogOutBtn from "../logout/LogOutBtn";
import type { ChatRoomDetail } from "@/features/chat/types/chat.types";
import { useAuthStore } from "@/features/auth/authStore";
import { decodeToken } from "@/features/auth/jwt";
import { loadNameHeader } from "@/features/chat/utils/chat.utils";

type Props = {
  isChatPage?: boolean;
  chatDetail?: ChatRoomDetail | null;
};

export default function Header({ isChatPage, chatDetail }: Props) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const token = useAuthStore((s) => s.accessToken);
  const isReady = Boolean(chatDetail && token);

  const headerUser = useMemo(() => {
    if (!isReady) return undefined;

    const payload = decodeToken(token!);
    const currentUserId = payload.sub;

    return chatDetail!.participants.find((p) => p.userId !== currentUserId)
      ?.user;
  }, [chatDetail, token, isReady]);

  if (!isChatPage) {
    return (
      <header className="app-header">
        <div className="header-left">
          <img
            src={theme === "dark" ? logoLight : logoDark}
            alt="Zeeep logo"
            className="header-logo"
          />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LogOutBtn />
        </div>
      </header>
    );
  }

  return (
    <header className="app-header chat-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      <div className="chat-header-info">
        {/* 🔥 Loading State */}
        {!isReady ? (
          <>
            <div className="chat-avatar skeleton-avatar" />
            <div>
              <div className="skeleton-text name" />
              <div className="skeleton-text status" />
            </div>
          </>
        ) : headerUser ? (
          <>
            <div className="chat-avatar">
              {headerUser.avatarUrl ? (
                <img src={headerUser.avatarUrl} alt="Avatar" />
              ) : (
                <>{loadNameHeader(headerUser, true)}</>
              )}
            </div>

            <div>
              <div className="chat-name">{loadNameHeader(headerUser)}</div>

              <div className="chat-status-wrapper">
                <span className="status-dot online" />
                <span className="chat-status">ออนไลน์</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="chat-avatar">NF</div>
            <div>
              <div className="chat-name">NOT FOUND</div>
              <div className="chat-status-wrapper">
                <span className="status-dot offline" />
                <span className="chat-status">ออฟไลน์</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="header-spacer" />
    </header>
  );
}
