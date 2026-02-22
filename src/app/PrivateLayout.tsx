import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuthStore } from "@/features/auth/authStore";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token: string) {
  const { exp } = jwtDecode<{ exp: number }>(token);
  return Date.now() >= exp * 1000;
}

export default function PrivateLayout() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat/");
  const token = useAuthStore((s) => s.accessToken);

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header isChatPage={isChatPage} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
      {!isChatPage && <BottomNav />}
    </div>
  );
}
