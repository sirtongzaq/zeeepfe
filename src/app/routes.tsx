import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import PrivateLayout from "./PrivateLayout";
import SignInPage from "@/features/auth/SignInPage";
import SignUpPage from "@/features/auth/SignUpPage";
import ChatPage from "@/features/chat/ChatPage";
import ChatListPage from "@/features/chat/ChatListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Mobile Frame
    children: [
      // Public routes
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },

      // Private routes
      {
        element: <PrivateLayout />,
        children: [
          { index: true, element: <ChatListPage /> },
          { path: "chat/:id", element: <ChatPage /> },
        ],
      },
    ],
  },
]);
