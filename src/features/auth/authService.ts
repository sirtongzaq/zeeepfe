import { useAuthStore } from "@/stores/authStore";

let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleLogout(exp: number) {
  const now = Date.now() / 1000;
  const timeout = (exp - now) * 1000;

  if (logoutTimer) clearTimeout(logoutTimer);

  console.log(`Access token will expire in ${Math.round(timeout / 1000)} seconds`);

  logoutTimer = setTimeout(() => {
    useAuthStore.getState().logout();
    window.location.href = "/signin";
  }, timeout);
}
