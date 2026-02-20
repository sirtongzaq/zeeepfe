import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function PrivateLayout() {
  const location = useLocation();

  const isChatPage = location.pathname.startsWith("/chat/");
  return (
    <div className="flex flex-col h-screen">
      <Header isChatPage={isChatPage} />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
      {!isChatPage && <BottomNav />}
    </div>
  );
}
