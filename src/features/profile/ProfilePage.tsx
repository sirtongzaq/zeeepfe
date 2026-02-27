import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { decodeToken } from "@/shared/lib/jwt";

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  if (!token) return null;

  const payload = decodeToken(token);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("otp_email");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Profile</h1>

      <div className="p-4 rounded-xl bg-gray-100">
        <p className="text-sm text-gray-500">User ID</p>
        <p className="font-mono">{payload.sub}</p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full h-12 rounded-2xl bg-red-500 text-white"
      >
        Logout
      </button>
    </div>
  );
}
