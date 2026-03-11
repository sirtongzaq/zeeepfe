export const ChatEvents = {
  ROOM_CREATED: "room_created",
  ROOM_UPDATED: "room_updated",
  MESSAGE_RECEIVED: "message_received",
  MESSAGE_READ: "message_read",
  TYPING: "typing",

  SEND_MESSAGE: "send_message",
  JOIN_ROOM: "join_room",
  MARK_READ: "mark_read",
} as const;
