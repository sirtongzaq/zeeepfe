import { useAuthStore } from "@/stores/authStore";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogOutBtn() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("otp_email");
    navigate("/signin", { replace: true });
  };

  return (
    <button className="theme-toggle" onClick={handleLogout}>
      <LogOutIcon size={18} />
    </button>
  );
}
