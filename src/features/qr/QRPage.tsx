import { useEffect, useState } from "react";
import QRMyProfile from "./QRMyProfile";
import QRScanner from "./QRScanner";
import { useNavigate } from "react-router-dom";

export default function QRPage() {
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentUser = {
    id: "1",
    name: "Narongrit",
  };

  // 🔥 navigate ตอน state เปลี่ยน
  useEffect(() => {
    if (chatUserId) {
      console.log("Navigating to chat with user:", `/chat/${chatUserId}`);
      navigate(`/chat/${chatUserId}`);
    }
  }, [chatUserId, navigate]);

  return (
    <div style={{ padding: 30 }}>
      {!chatUserId && (
        <>
          <QRMyProfile userId={currentUser.id} name={currentUser.name} />

          <hr />

          <h3>Scan to Chat</h3>
          <QRScanner onSuccess={setChatUserId} />
        </>
      )}
    </div>
  );
}
