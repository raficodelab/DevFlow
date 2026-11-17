import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../features/auth/useAuth";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h3>DevFlow Dashboard</h3>

          <div className="dashboard-user-actions">
            <span>Hi, {user?.name}</span>
            <button onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}