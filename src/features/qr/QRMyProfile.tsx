import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { encodeQR } from "./utils/qr.utils";

interface Props {
  userId: string;
  name: string;
}

export default function QRMyProfile({ userId, name }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}-qr.png`;
    link.click();
  };

  return (
    <div className="qr-my-container">
      <div ref={qrRef} className="qr-card-animated qr-card">
        <QRCodeCanvas
          className="qr-glow"
          value={encodeQR({ userId })}
          size={300}
          level="H"
          fgColor="#3b82f6"
        />

        <p className="qr-name">{name}</p>
        <p className="qr-subtitle">Scan to add me</p>
      </div>

      <button onClick={handleDownload} className="btn-primary qr-download-btn">
        ดาวน์โหลด QR
      </button>
    </div>
  );
}
