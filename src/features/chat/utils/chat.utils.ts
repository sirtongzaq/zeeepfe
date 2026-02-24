import type { ChatRoom, Sender } from "../types/chat.types";

export function loadName(room: ChatRoom, isAvatar = false) {
  const text =
    room.name ??
    room.lastMessage?.sender?.nickname ??
    room.lastMessage?.sender?.email ??
    "";

  const safeText = text.trim();

  if (!isAvatar) return safeText;

  if (!safeText) return "";

  const words = safeText.split(" ");

  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return safeText.slice(0, 2).toUpperCase();
}

export function loadNameHeader(sender: Sender, isAvatar = false) {
  const text = sender.nickname ?? sender.email ?? "";

  const safeText = text.trim();

  if (!isAvatar) return safeText;

  if (!safeText) return "";

  const words = safeText.split(" ");

  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return safeText.slice(0, 2).toUpperCase();
}
