import { NavLink, Outlet } from "react-router-dom";
import QuickExit from "./QuickExit";
import Icon from "./Icon";

const tabs = [
  { to: "/app", label: "Home", icon: "home", end: true },
  { to: "/app/comfort-map", label: "Comfort", icon: "comfort-map" },
  { to: "/app/shared", label: "Shared", icon: "shared-space" },
  { to: "/app/check-in", label: "Check-in", icon: "check-in" },
  { to: "/app/settings", label: "Settings", icon: "settings" },
];

export default function Layout() {
  return (
    <>
      <QuickExit />
      <Outlet />
      <nav className="nav">
        {tabs.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="navicon">
              {/* bare = line art only; color inherits from the tab so active turns cream */}
              <Icon name={icon} bare color="currentColor" size={22} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
