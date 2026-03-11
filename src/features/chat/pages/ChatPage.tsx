import { useEffect, useRef, useState, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import type { ChatRoomDetail, Message } from "../types/chat.types";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { socket } from "@/shared/lib/socket";
import React from "react";
import { chatApi } from "../api/api";
import { ChatEvents } from "../constants/chatEvents";

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

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  //////////////////////////////////////////////////////
  // LOAD INITIAL
  //////////////////////////////////////////////////////

  const loadInitialMessages = useCallback(async () => {
    if (!chatRoomId) return;

    try {
      const [resRoomDetail, resMessages] = await Promise.all([
        chatApi.getRoomDetail(chatRoomId),
        chatApi.getMessages(chatRoomId, null),
      ]);

      const { messages, nextCursor, hasMore } = resMessages.data.data;
      const detail = resRoomDetail.data.data;

      setMessages(messages.reverse());
      setCursor(nextCursor);
      setHasMore(hasMore);

      setChatDetail(detail);

      socket.emit(ChatEvents.JOIN_ROOM, { chatRoomId });

      resetRoomUnread(chatRoomId);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView();
      }, 50);
    } catch (err) {
      console.error("❌ load chat failed", err);
    }
  }, [chatRoomId, setChatDetail, resetRoomUnread]);

  useEffect(() => {
    loadInitialMessages();
  }, [loadInitialMessages]);

  //////////////////////////////////////////////////////
  // LOAD MORE (CURSOR PAGINATION)
  //////////////////////////////////////////////////////

  const loadMoreMessages = async () => {
    if (!chatRoomId || !cursor || !hasMore || loadingMore) return;

    try {
      setLoadingMore(true);

      const container = containerRef.current;
      const previousHeight = container?.scrollHeight ?? 0;

      const res = await chatApi.getMessages(chatRoomId, cursor);

      const { messages: older, nextCursor, hasMore } = res.data.data;

      setMessages((prev) => [...older.reverse(), ...prev]);

      setCursor(nextCursor);
      setHasMore(hasMore);

      setTimeout(() => {
        if (!container) return;

        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - previousHeight;
      }, 0);
    } catch (err) {
      console.error("❌ load more failed", err);
    } finally {
      setLoadingMore(false);
    }
  };

  //////////////////////////////////////////////////////
  // REALTIME MESSAGE
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    const handleNewMessage = (message: Message) => {
      if (message.chatRoomId !== chatRoomId) return;

      const isMe = message.senderId === currentUser?.id;

      console.log("message.senderId", message.senderId);
      console.log("currentUser.id", currentUser?.id);

      setMessages((prev) => {
        // ถ้ามี id เดียวกันอยู่แล้ว
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;

        // หา optimistic message ของตัวเอง
        const optimisticIndex = prev.findIndex(
          (m) =>
            m.senderId === message.senderId &&
            m.content === message.content &&
            m.id.startsWith("temp-"),
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = message;
          return updated;
        }

        return [...prev, message];
      });
      if (isMe) return;

      if (isAtBottom) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView();
        }, 50);

        socket.emit(ChatEvents.MARK_READ, { chatRoomId });
        return;
      }

      setUnreadCount((prev) => prev + 1);
    };

    socket.on(ChatEvents.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      socket.off(ChatEvents.MESSAGE_RECEIVED, handleNewMessage);
    };
  }, [chatRoomId, currentUser?.id, isAtBottom]);

  //////////////////////////////////////////////////////
  // MESSAGE READ
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    const handleRead = (data: { chatRoomId: string; userId: string }) => {
      if (data.chatRoomId !== chatRoomId) return;

      if (data.userId === currentUser?.id) return;

      console.log("messages read by", data.userId);
    };

    socket.on(ChatEvents.MESSAGE_READ, handleRead);

    return () => {
      socket.off(ChatEvents.MESSAGE_READ, handleRead);
    };
  }, [chatRoomId, currentUser?.id]);

  //////////////////////////////////////////////////////
  // TYPING
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    const handleTyping = (data: {
      chatRoomId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (data.chatRoomId !== chatRoomId) return;

      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (prev.includes(data.userId)) return prev;
          return [...prev, data.userId];
        }

        return prev.filter((id) => id !== data.userId);
      });
    };

    socket.on(ChatEvents.TYPING, handleTyping);

    return () => {
      socket.off(ChatEvents.TYPING, handleTyping);
    };
  }, [chatRoomId]);

  //////////////////////////////////////////////////////
  // SEND MESSAGE (OPTIMISTIC)
  //////////////////////////////////////////////////////

  const handleSend = () => {
    if (!input.trim() || !chatRoomId || !currentUser) return;

    const tempId = "temp-" + crypto.randomUUID();

    const optimistic: Message = {
      id: tempId,
      chatRoomId,
      senderId: currentUser.id,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    socket.emit(ChatEvents.SEND_MESSAGE, {
      chatRoomId,
      content: input.trim(),
    });

    setInput("");

    setTimeout(() => {
      bottomRef.current?.scrollIntoView();
    }, 50);
  };

  //////////////////////////////////////////////////////
  // TYPING EMIT
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (!chatRoomId) return;

    socket.emit(ChatEvents.TYPING, {
      chatRoomId,
      isTyping: true,
    });

    const timeout = setTimeout(() => {
      socket.emit(ChatEvents.TYPING, {
        chatRoomId,
        isTyping: false,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [input, chatRoomId]);

  //////////////////////////////////////////////////////
  // ACTIVE ROOM
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (chatRoomId) {
      useChatStore.getState().setActiveRoom(chatRoomId);
    }

    return () => {
      useChatStore.getState().setActiveRoom(null);
    };
  }, [chatRoomId]);

  //////////////////////////////////////////////////////
  // DATE SEPARATOR
  //////////////////////////////////////////////////////

  function shouldShowDateSeparator(current: Date, previous?: Date) {
    if (!previous) return true;

    return (
      current.getFullYear() !== previous.getFullYear() ||
      current.getMonth() !== previous.getMonth() ||
      current.getDate() !== previous.getDate()
    );
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="flex flex-col h-full relative">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
        onScroll={(e) => {
          const target = e.currentTarget;

          const atBottom =
            target.scrollHeight - target.scrollTop <= target.clientHeight + 80;

          setIsAtBottom(atBottom);

          if (atBottom) {
            setUnreadCount(0);
          }

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
                  {currentDate.toLocaleDateString()}
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

        {typingUsers.length > 0 && (
          <div className="text-xs text-gray-400 px-2">กำลังพิมพ์...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {!isAtBottom && unreadCount > 0 && (
        <div className="chat-new-message-popup">
          <button
            onClick={() => {
              bottomRef.current?.scrollIntoView();
              setUnreadCount(0);
            }}
            className="chat-new-message-btn"
          >
            ข้อความใหม่ {unreadCount} ↓
          </button>
        </div>
      )}

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
