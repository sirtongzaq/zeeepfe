import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Create account
          </h2>
          <p className="text-sm text-secondary">
            สมัครสมาชิกเพื่อเริ่มใช้งาน
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full h-12 px-4 input-clean"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 px-4 input-clean"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 px-4 input-clean"
          />

          <button className="w-full h-12 btn-primary font-medium">
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-secondary">
          มีบัญชีแล้ว?{" "}
          <Link
            to="/signin"
            className="font-medium"
            style={{ color: "var(--primary)" }}
          >
            เข้าสู่ระบบ
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}