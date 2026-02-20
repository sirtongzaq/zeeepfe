import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-secondary">
            เข้าสู่ระบบเพื่อเริ่มแชท
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 px-4 rounded-2xl input-clean"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 px-4 rounded-2xl input-clean"
          />

          <button className="w-full h-12 rounded-2xl btn-primary font-medium">
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-secondary">
          ยังไม่มีบัญชี?{" "}
          <Link
            to="/signup"
            className="font-medium"
            style={{ color: "var(--primary)" }}
          >
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}