export interface AvatarSignatureResponse {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId: string;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}
