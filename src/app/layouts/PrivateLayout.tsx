import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuthStore } from "@/stores/authStore";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import type { ChatRoomDetail } from "@/features/chat/types/chat.types";
import { SocketProvider } from "../providers/SocketProvider";
import ChatProvider from "../providers/ChatProvider";

function isTokenExpired(token: string) {
  const { exp } = jwtDecode<{ exp: number }>(token);
  return Date.now() >= exp * 1000;
}

export default function PrivateLayout() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat/");
  const token = useAuthStore((s) => s.accessToken);

  const [chatDetail, setChatDetail] = useState<ChatRoomDetail>();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return (
    <>
      <SocketProvider />
      <ChatProvider />
      <div className="flex flex-col flex-1 min-h-0">
        <Header isChatPage={isChatPage} chatDetail={chatDetail} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Outlet context={{ setChatDetail }} />
        </div>
        {!isChatPage && <BottomNav />}
      </div>
    </>
  );
}
