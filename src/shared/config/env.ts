export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "",
  VITE_API_PREFIX: import.meta.env.VITE_API_PREFIX || "/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "ZEEEP",
  MODE: import.meta.env.VITE_ENV,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
