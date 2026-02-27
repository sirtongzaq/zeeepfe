import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeToken } from "@/shared/lib/jwt";

interface User {
  id: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;

  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setToken: (token) => {
        const payload = decodeToken(token);

        set({
          accessToken: token,
          user: {
            id: payload.sub,
          },
        });
      },

      logout: () =>
        set({
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
