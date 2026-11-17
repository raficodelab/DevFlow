import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/dashboard/projects" },
  { label: "Tasks", path: "/dashboard/tasks" },
  { label: "Sprints", path: "/dashboard/sprints" },
];
export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <h2>DevFlow</h2>

      <nav aria-label="Dashboard navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            style={({ isActive }) => ({
              display: "block",
              padding: "12px",
              marginBottom: "8px",
              textDecoration: "none",
              color: isActive ? "#ffffff" : "#cbd5e1",
              backgroundColor: isActive ? "#2563eb" : "transparent",
              borderRadius: "8px",
              fontWeight: isActive ? "600" : "400",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}