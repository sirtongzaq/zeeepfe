import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  AvatarSignatureResponse,
  UpdateProfilePayload,
  UserProfile,
} from "../types/profile.types";

export const profileApi = {
  // 🔐 ขอ signature สำหรับ avatar
  getAvatarSignature: () =>
    api.get<ApiResponse<AvatarSignatureResponse>>("/upload/avatar-signature"),

  // 👤 ดูโปรไฟล์ตัวเอง
  getMyProfile: () => api.get<ApiResponse<UserProfile>>("/users/me"),

  // 🌍 ดูโปรไฟล์ public
  getPublicProfile: (userId: string) =>
    api.get<ApiResponse<UserProfile>>(`/users/${userId}`),

  // 👤 update profile (รวม avatarUrl)
  updateProfile: (payload: UpdateProfilePayload) =>
    api.patch<ApiResponse<never>>("/users", payload),
};
