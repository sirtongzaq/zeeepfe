import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "สวัสดี 👋", sender: "other" },
    { id: 2, text: "ดีครับ", sender: "me" },
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleBlur = () => {
    if (!isMobile()) return;
    window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "ตอบกลับอัตโนมัติ 🤖",
          sender: "other",
        },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
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
