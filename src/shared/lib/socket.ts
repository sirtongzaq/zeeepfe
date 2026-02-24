import { io } from "socket.io-client";
import { ENV } from "@/shared/config/env";

export const socket = io(ENV.SOCKET_URL || undefined, {
  autoConnect: false,
});
