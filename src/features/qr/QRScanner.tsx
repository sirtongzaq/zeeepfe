import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState } from "react";
import { decodeQR } from "./utils/qr.utils";

interface Props {
  onSuccess: (userId: string) => void;
}

export default function QRScanner({ onSuccess }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 kill media track จริง ๆ
  const forceStopCamera = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      const stream = video.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    });
  };

  const startScanner = async () => {
    if (isRunningRef.current) return;

    setIsOpen(true); // ⭐ render div ก่อน

    // รอให้ DOM update ก่อน
    setTimeout(async () => {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices?.length) throw new Error("No camera found");

        await scanner.start(
          devices[0].id,
          { fps: 10 },
          async (decodedText) => {
            const parsed = decodeQR(decodedText);
            if (!parsed?.userId) return;

            await stopScanner();
            onSuccess(parsed.userId);
          },
          () => {},
        );

        isRunningRef.current = true;
      } catch (err) {
        console.error("Camera start failed:", err);
      }
    }, 0);
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;

    try {
      if (isRunningRef.current) {
        await scannerRef.current.stop();
        isRunningRef.current = false;
      }

      await scannerRef.current.clear();
    } catch {
      console.error("Camera stop failed");
    }

    forceStopCamera(); // 🔥 สำคัญ
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen && <button onClick={startScanner}>เปิดกล้อง</button>}

      {isOpen && <button onClick={stopScanner}>ปิดกล้อง</button>}

      {/* ⭐ ต้อง render ตลอด */}
      <div
        id="reader"
        style={{
          width: 300,
          marginTop: 10,
        }}
      />
    </div>
  );
}
