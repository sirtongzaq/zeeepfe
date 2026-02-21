import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { decodeQR } from "./utils/qr.utils";

interface Props {
  onSuccess: (userId: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function QRScanner({ onSuccess, onLoadingChange }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isMountedRef = useRef(false);
  const isStoppingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDev = import.meta.env.DEV;
  const hasRenderedOnce = useRef(false);

  const isMobileDevice = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const forceKillStream = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    });
  };

  const safeStop = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    const scanner = scannerRef.current;

    try {
      if (scanner) {
        const state = scanner.getState();

        if (state === Html5QrcodeScannerState.SCANNING) {
          await scanner.stop().catch(() => {});
        }

        await scanner.clear();
      }

      forceKillStream(); // 🔥 สำคัญ
    } finally {
      scannerRef.current = null;
      isStoppingRef.current = false;
    }
  }, []);

  const startScanner = useCallback(async () => {
    try {
      setIsLoading(true);
      onLoadingChange(true);

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const devices = await Html5Qrcode.getCameras();
      if (!devices?.length) throw new Error("No camera found");

      await scanner.start(
        isMobileDevice() ? { facingMode: "environment" } : devices[0].id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (!isMountedRef.current) return;

          const parsed = decodeQR(decodedText);
          if (!parsed?.userId) return;

          await safeStop();
          onSuccess(parsed.userId);
        },
        () => {},
      );

      if (isMountedRef.current) {
        setTimeout(() => {
          setIsLoading(false);
          onLoadingChange(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Camera start failed:", err);
      setTimeout(() => {
        setIsLoading(false);
        onLoadingChange(false);
      }, 1000);
    }
  }, [safeStop, onSuccess, onLoadingChange]);

  useEffect(() => {
    if (isDev && !hasRenderedOnce.current) {
      hasRenderedOnce.current = true;
      return;
    }
    isMountedRef.current = true;

    startScanner();

    const handleVisibility = () => {
      if (document.hidden) {
        safeStop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMountedRef.current = false;
      safeStop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isDev, startScanner, safeStop]);

  return (
    <div className="qr-container">
      <div className="qr-card">
        <div className="qr-header">
          <h2>Scan QR Code</h2>
        </div>

        <div className="qr-reader-wrapper">
          {isLoading && (
            <div className="qr-loading-overlay">
              <div className="spinner" />
              <span>Starting camera...</span>
            </div>
          )}
          <div id="reader" className="qr-reader" />
        </div>
      </div>
    </div>
  );
}