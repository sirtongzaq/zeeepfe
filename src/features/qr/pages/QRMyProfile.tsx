import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { encodeQR } from "../utils/qr.utils";

interface Props {
  userId: string;
  name: string;
}

export default function QRMyProfile({ userId, name }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  const isMobileDevice = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
      <div ref={qrRef} className="qr-card">
        <QRCodeCanvas
          className="qr-glow"
          value={encodeQR({ userId })}
          size={isMobileDevice() ? 240 : 300}
          level="H"
          fgColor="#3b82f6"
          style={{ margin: "auto" }}
        />

        {/* Divider */}
        <div className="addfriend-divider">
          <span>Download QR Code</span>
        </div>

        {/* My ID Section */}
        <button onClick={handleDownload} className="btn btn-primary">
          ดาวน์โหลด QR
        </button>
      </div>
    </div>
  );
}
