import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { RequestOtpResponse, VerifyOtpResponse } from "./types";

export const authApi = {
  requestOtp: (email: string) =>
    api.post<ApiResponse<RequestOtpResponse>>("/auth/request-otp", { email }),

  verifyOtp: (email: string, code: string) =>
    api.post<ApiResponse<VerifyOtpResponse>>("/auth/verify-otp", {
      email,
      code,
    }),
};
