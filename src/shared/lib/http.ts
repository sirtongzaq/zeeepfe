import axios from "axios";

// shared/lib/http.ts
export const createHttpClient = (baseURL: string) =>
  axios.create({
    baseURL,
    withCredentials: true,
  });
