import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/api";
import AuthLayout from "@/app/layouts/AuthLayout";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await authApi.requestOtp(email);
    sessionStorage.setItem("otp_email", email);
    navigate("/otp", { state: { email } });
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-12 px-4 rounded-2xl input-clean"
        />
        <button className="w-full h-12 rounded-2xl btn-primary">
          Continue
        </button>
      </form>
    </AuthLayout>
  );
}
