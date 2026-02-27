export type ChatRoom = {
  id: string;
  name: string;
  isGroup?: boolean;
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount?: number;
  otherUser?: Sender | null;
};

export type ChatMessage = {
  messages: Message[];
  nextCursor: null;
  hasMore: boolean;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: string;
  sender?: Sender;
};

export type Sender = {
  id: string;
  email?: string;
  nickname: string;
  bio: string;
  avatarUrl: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ChatRoomDetail = {
  id: string;
  name: string;
  isGroup?: boolean;
  createdById?: string;
  createdAt: string;
  participants: ChatRoomParticipant[];
};

export type ChatRoomParticipant = {
  id: string;
  userId: string;
  chatRoomId: string;
  role: "admin" | "member";
  lastReadAt: Date;
  joinedAt: Date;
  user: Sender;
};

export interface RoomUpdatedPayload {
  chatRoomId: string;
  lastMessage: Message;
  lastMessageAt: Date;
  senderId: string;
}

export interface RoomReadPayload {
  chatRoomId: string;
}
