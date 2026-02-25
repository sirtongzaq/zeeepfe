import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRMyProfile from "./QRMyProfile";
import QRScanner from "./QRScanner";
import { chatApi } from "../chat/api";
import { useAuthStore } from "@/stores/authStore";

export default function QRPage() {
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"myqr" | "scan">("myqr");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const handleScanSuccess = useCallback(
    async (targetUserId: string) => {
      try {
        console.log("📷 Scanned userId:", targetUserId);

        const res = await chatApi.getOrCreatePrivateRoom(targetUserId);

        console.log("✅ Room created or fetched successfully:", res.data);

        const chatRoomId = res.data.data.id;

        console.log("🏠 Got room:", chatRoomId);

        navigate(`/chat/${chatRoomId}`);
      } catch (err) {
        console.error("❌ Create room failed", err);
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (chatUserId) {
      handleScanSuccess(chatUserId);
    }
  }, [chatUserId, handleScanSuccess, navigate]);

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

        {/* <button
          className={`qr-tab-btn ${activeTab === "scan" ? "active" : ""} ${isLoading ? "disabled" : ""}`}
          disabled={isLoading}
          onClick={() => setActiveTab("addfriend")}
        >
          Add Friend
        </button> */}
      </div>

      <div className="qr-content">
        {activeTab === "myqr" && (
          <div className="qr-my-wrapper">
            <QRMyProfile userId={currentUser!.id} name={currentUser!.id} />
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
