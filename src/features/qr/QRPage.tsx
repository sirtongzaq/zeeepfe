import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRMyProfile from "./QRMyProfile";
import QRScanner from "./QRScanner";

export default function QRPage() {
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"myqr" | "scan">("myqr");
  const navigate = useNavigate();

  const currentUser = {
    id: "1",
    name: "Narongrit",
  };

  useEffect(() => {
    if (chatUserId) {
      navigate(`/chat/${chatUserId}`);
    }
  }, [chatUserId, navigate]);

  return (
    <div className="app-container">
      <div className="qr-tabs">
        <button
          className={`qr-tab-btn ${activeTab === "myqr" ? "active" : ""}`}
          onClick={() => setActiveTab("myqr")}
        >
          My QR
        </button>

        <button
          className={`qr-tab-btn ${activeTab === "scan" ? "active" : ""}`}
          onClick={() => setActiveTab("scan")}
        >
          Scan QR
        </button>
      </div>

      <div className="qr-content">
        {activeTab === "myqr" && (
          <div className="qr-my-wrapper">
            <QRMyProfile userId={currentUser.id} name={currentUser.name} />
          </div>
        )}

        {activeTab === "scan" && (
          <div className="qr-scan-wrapper">
            <QRScanner onSuccess={setChatUserId} />
          </div>
        )}
      </div>
    </div>
  );
}
