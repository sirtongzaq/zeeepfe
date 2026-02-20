import type { QRPayload } from "../types/qr.types";

export const encodeQR = (payload: QRPayload) => {
  return JSON.stringify(payload);
};

export const decodeQR = (raw: string): QRPayload | null => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
