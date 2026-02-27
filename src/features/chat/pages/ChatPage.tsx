import { useEffect, useRef, useState, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import type { ChatRoomDetail, Message } from "../types/chat.types";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { socket } from "@/shared/lib/socket";
import React from "react";
import { chatApi } from "../api/api";

type OutletContextType = {
  setChatDetail: (detail: ChatRoomDetail) => void;
};

export default function ChatPage() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const { setChatDetail } = useOutletContext<OutletContextType>();

  const currentUser = useAuthStore((s) => s.user);
  const resetRoomUnread = useChatStore((s) => s.resetRoomUnread);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  ////////////////////////////////////////////////////////
  // โหลดรอบแรก
  ////////////////////////////////////////////////////////

  const loadInitialMessages = useCallback(async () => {
    if (!chatRoomId) return;

    try {
      const [resRoomDetail, resMessages] = await Promise.all([
        chatApi.getRoomDetail(chatRoomId),
        chatApi.getMessages(chatRoomId, null),
      ]);

      const { messages, nextCursor, hasMore } = resMessages.data.data;
      const detail = resRoomDetail.data.data;

      setMessages(messages.reverse()); // เก่า → ใหม่
      setCursor(nextCursor);
      setHasMore(hasMore);
      setChatDetail(detail);

      socket.emit("join_room", { chatRoomId });
      resetRoomUnread(chatRoomId);

      // scroll ลงล่างสุดตอนโหลดครั้งแรก
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }, 0);
    } catch (err) {
      console.error("❌ load chat failed", err);
    }
  }, [chatRoomId, setChatDetail, resetRoomUnread]);

  useEffect(() => {
    loadInitialMessages();

    return () => {
      if (chatRoomId) {
        socket.emit("leave_room", { chatRoomId });
      }
    };
  }, [chatRoomId, loadInitialMessages]);

  ////////////////////////////////////////////////////////
  // โหลดข้อความเก่า (Cursor Pagination)
  ////////////////////////////////////////////////////////

  const loadMoreMessages = async () => {
    if (!chatRoomId || !cursor || !hasMore || loadingMore) return;

    try {
      setLoadingMore(true);

      const scrollContainer = containerRef.current;
      const previousHeight = scrollContainer?.scrollHeight ?? 0;

      const res = await chatApi.getMessages(chatRoomId, cursor);
      const { messages: olderMessages, nextCursor, hasMore } = res.data.data;

      setMessages((prev) => [...olderMessages.reverse(), ...prev]);

      setCursor(nextCursor);
      setHasMore(hasMore);

      // 🔥 รักษาตำแหน่ง scroll
      setTimeout(() => {
        if (!scrollContainer) return;
        const newHeight = scrollContainer.scrollHeight;
        scrollContainer.scrollTop = newHeight - previousHeight;
      }, 0);
    } catch (err) {
      console.error("❌ load more failed", err);
    } finally {
      setLoadingMore(false);
    }
  };

  ////////////////////////////////////////////////////////
  // Realtime
  ////////////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    const handleNewMessage = (message: Message) => {
      if (message.chatRoomId !== chatRoomId) return;

      const scrollContainer = containerRef.current;
      const isAtBottom =
        scrollContainer &&
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
          scrollContainer.clientHeight + 100;

      setMessages((prev) => [...prev, message]);

      if (isAtBottom) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [chatRoomId]);

  ////////////////////////////////////////////////////////
  // ส่งข้อความ
  ////////////////////////////////////////////////////////

  const handleSend = () => {
    if (!input.trim() || !chatRoomId) return;

    socket.emit("send_message", {
      chatRoomId,
      content: input.trim(),
    });

    setInput("");
  };

  ////////////////////////////////////////////////////////
  // Logic อื่นๆ
  ////////////////////////////////////////////////////////

  function shouldShowDateSeparator(current: Date, previous?: Date) {
    if (!previous) return true;

    return (
      current.getFullYear() !== previous.getFullYear() ||
      current.getMonth() !== previous.getMonth() ||
      current.getDate() !== previous.getDate()
    );
  }

  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////

  return (
    <div className="flex flex-col h-full">
      {/* Message Area */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-2"
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollTop === 0) {
            loadMoreMessages();
          }
        }}
      >
        {loadingMore && (
          <div className="text-center text-xs text-gray-400">กำลังโหลด...</div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser?.id;

          const currentDate = new Date(msg.createdAt);
          const prevDate =
            index > 0 ? new Date(messages[index - 1].createdAt) : undefined;

          const showDateSeparator = shouldShowDateSeparator(
            currentDate,
            prevDate,
          );

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className="chat-separator">
                  {currentDate.toLocaleDateString([], {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}

              <div className={`chat-row ${isMe ? "me" : "other"}`}>
                <div className={`chat-bubble ${isMe ? "me" : "other"}`}>
                  {msg.content}
                </div>

                <span className="chat-time">
                  {currentDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </React.Fragment>
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
