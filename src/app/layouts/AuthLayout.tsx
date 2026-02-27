import type { ReactNode } from "react";
import logoLight from "@/assets/logo_light_lg.png";
import logoDark from "@/assets/logo_dark_lg.png";
import { useTheme } from "@/components/theme/useTheme";
type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const { theme } = useTheme();
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <img
          src={theme === "dark" ? logoLight : logoDark}
          alt="Zeeep logo"
          className="auth-logo"
        />
        {children}
      </div>
    </div>
  );
}
