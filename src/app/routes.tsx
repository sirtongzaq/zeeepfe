import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import PrivateLayout from "./PrivateLayout";
import SignInPage from "@/features/auth/SignInPage";
import ChatPage from "@/features/chat/ChatPage";
import ChatListPage from "@/features/chat/ChatListPage";
import QRPage from "@/features/qr/QRPage";
import OtpPage from "@/features/auth/OtpPage";
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
