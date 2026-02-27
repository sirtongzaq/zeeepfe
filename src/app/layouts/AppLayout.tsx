import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-container">
        <Outlet />
      </div>
    </div>
  );
}