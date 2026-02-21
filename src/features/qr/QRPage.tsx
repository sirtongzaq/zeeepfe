import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRMyProfile from "./QRMyProfile";
import QRScanner from "./QRScanner";

export default function QRPage() {
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"myqr" | "scan">("myqr");
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="flex-1 flex flex-col h-full">
      <div className="qr-tabs">
        <button
          className={`qr-tab-btn ${activeTab === "myqr" ? "active" : ""} ${isLoading ? "disabled" : ""}`}
          disabled={isLoading}
          onClick={() => setActiveTab("myqr")}
        >
          My QR
        </button>

        <button
          className={`qr-tab-btn ${activeTab === "scan" ? "active" : ""} ${isLoading ? "disabled" : ""}`}
          disabled={isLoading}
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
            <QRScanner
              onSuccess={setChatUserId}
              onLoadingChange={setIsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
