import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { chatApi } from "@/features/chat/api";
import type { ChatRoomDetail, Message } from "./types/chat.types";
import { useAuthStore } from "../auth/authStore";
import { socket } from "@/shared/lib/socket";
import { decodeToken } from "../auth/jwt";

type OutletContextType = {
  setChatDetail: (detail: ChatRoomDetail) => void;
};

export default function ChatPage() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { setChatDetail } = useOutletContext<OutletContextType>();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const token = useAuthStore((s) => s.accessToken);
  const currentUserId = decodeToken(token || "fake token").sub;
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const handleBlur = () => {
    if (!isMobile()) return;
    window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    });
  };

  ////////////////////////////////////////////////
  // socket connect
  ////////////////////////////////////////////////

  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  ////////////////////////////////////////////////
  // load messages
  ////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    const loadMessages = async () => {
      const resRoomDetail = await chatApi.getRoomDetail(chatRoomId);
      const resMessages = await chatApi.getMessages(chatRoomId);

      const messages = resMessages.data.data.messages;
      const detail = resRoomDetail.data.data;

      setMessages(messages);
      setChatDetail(detail);

      socket.emit("join_room", { chatRoomId });
    };

    loadMessages();
  }, [chatRoomId, setChatDetail]);

  ////////////////////////////////////////////////
  // realtime
  ////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    const handler = (message: Message) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("new_message", handler);

    return () => {
      socket.off("new_message", handler);
    };
  }, [chatRoomId]);

  ////////////////////////////////////////////////
  // send message
  ////////////////////////////////////////////////

  const handleSend = () => {
    if (!input.trim() || !chatRoomId) return;

    socket.emit("send_message", {
      chatRoomId,
      content: input,
    });

    handleBlur();

    setInput("");
  };

  ////////////////////////////////////////////////
  // auto scroll
  ////////////////////////////////////////////////

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  ////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////

  return (
    <div className="flex flex-col h-full">
      {/* Message Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`chat-bubble ${isMe ? "me" : "other"}`}
            >
              {msg.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {/* Input Bar */}
      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          <input
            type="text"
            placeholder="พิมพ์ข้อความ..."
            className="chat-input-field"
            value={input}
            onBlur={handleBlur}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="chat-send-btn disabled:opacity-40"
          >
            ส่ง
          </button>
        </div>
      </div>
    </div>
  );
}
