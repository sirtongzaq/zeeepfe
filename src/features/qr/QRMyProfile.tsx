import { QRCodeCanvas } from "qrcode.react";
import { encodeQR } from "./utils/qr.utils";

interface Props {
  userId: string;
  name: string;
}

export default function QRMyProfile({ userId, name }: Props) {
  return (
    <div>
      <h3>My Profile QR</h3>

      <QRCodeCanvas value={encodeQR({ userId })} size={220} />

      <p>{name}</p>
    </div>
  );
}
