import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRScanner from "./QRScanner";
import { useAuthStore } from "@/stores/authStore";
import { chatApi } from "@/features/chat/api/api";
import QRMyProfile from "./QRMyProfile";
import AddFriend from "./AddFriend";
export default function QRPage() {
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"addfriend" | "myqr" | "scan">(
    "addfriend",
  );
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
          className={`qr-tab-btn ${activeTab === "addfriend" ? "active" : ""} ${isLoading ? "disabled" : ""}`}
          disabled={isLoading}
          onClick={() => setActiveTab("addfriend")}
        >
          Add Friend
        </button>

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
        {activeTab === "addfriend" && (
          <div className="qr-my-wrapper">
            <AddFriend userId={currentUser!.id} onAddFriend={setChatUserId} />
          </div>
        )}

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
