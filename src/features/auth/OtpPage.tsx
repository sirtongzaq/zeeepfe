import { useCallback, useEffect, useRef, useState } from "react";
import { authApi } from "./api";
import AuthLayout from "./AuthLayout";
import { scheduleLogout } from "./authService";
import { useAuthStore } from "./authStore";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateEmail = location.state?.email;
  const storedEmail = sessionStorage.getItem("otp_email");
  const email = stateEmail || storedEmail;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/signin", { replace: true });

    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [email, cooldown, navigate]);

  const code = otp.join("");

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const handleVerify = useCallback(
    async (finalCode: string) => {
      const res = await authApi.verifyOtp(email, finalCode);
      const { accessToken } = res.data.data;

      useAuthStore.getState().setToken(accessToken);

      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      scheduleLogout(payload.exp);

      sessionStorage.removeItem("otp_email");
      navigate("/");
    },
    [email, navigate],
  );

  useEffect(() => {
    if (code.length === 6 && !otp.includes("")) {
      handleVerify(code);
    }
  }, [code, handleVerify, otp]);

  return (
    <AuthLayout>
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Verify Code</h2>
          <p className="text-sm text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el: never) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="
                w-12 h-14
                text-2xl text-center
                rounded-xl
                border border-gray-300
                focus:border-black
                focus:outline-none
                transition
              "
            />
          ))}
        </div>

        <button
          disabled={cooldown > 0}
          onClick={() => authApi.requestOtp(email)}
          className="text-sm text-gray-500"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </button>
      </div>
    </AuthLayout>
  );
}
