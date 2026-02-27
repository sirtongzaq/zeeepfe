import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import SignInPage from "@/features/auth/pages/SignInPage";
import ChatPage from "@/features/chat/pages/ChatPage";
import ChatListPage from "@/features/chat/pages/ChatListPage";
import QRPage from "@/features/qr/pages/QRPage";
import OtpPage from "@/features/auth/pages/OtpPage";
import ProfilePage from "@/features/profile/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Mobile Frame
    children: [
      // Public routes
      { path: "signin", element: <SignInPage /> },
      { path: "otp", element: <OtpPage /> },
      // Private routes
      {
        element: <PrivateLayout />,
        children: [
          { index: true, element: <ChatListPage /> },
          { path: "chat/:chatRoomId", element: <ChatPage /> },
          { path: "qr", element: <QRPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
