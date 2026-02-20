export interface QRPayload {
  userId: string;
}

export interface QRScannerProps {
  onSuccess: (payload: QRPayload) => void;
}