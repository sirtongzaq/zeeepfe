import type { ChatRoom, Sender } from "../types/chat.types";

//////////////////////////////////////////////////
// CHAT LIST NAME (1-1 + GROUP)
//////////////////////////////////////////////////

export function loadName(room: ChatRoom, isAvatar = false) {
  let text = "";

  ////////////////////////////////////////////
  // 🔥 Group Chat
  ////////////////////////////////////////////
  if (room.isGroup) {
    text = room.name ?? "Unnamed Group";
  }

  ////////////////////////////////////////////
  // 🔥 1-1 Chat
  ////////////////////////////////////////////
  else {
    text = room.otherUser?.nickname ?? room.otherUser?.email ?? "";
  }

  const safeText = text.trim();

  if (!isAvatar) return safeText;

  if (!safeText) return "";

  const words = safeText.split(" ");

  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return safeText.slice(0, 2).toUpperCase();
}

//////////////////////////////////////////////////
// HEADER NAME
//////////////////////////////////////////////////

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
