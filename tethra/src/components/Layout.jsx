import { NavLink, Outlet } from "react-router-dom";
import QuickExit from "./QuickExit";
import { IconHome, IconMap, IconUsers, IconCheckIn, IconSettings } from "./Icons";

const tabs = [
  { to: "/app", label: "Home", Icon: IconHome, end: true },
  { to: "/app/comfort-map", label: "Comfort", Icon: IconMap },
  { to: "/app/shared", label: "Shared", Icon: IconUsers },
  { to: "/app/check-in", label: "Check-in", Icon: IconCheckIn },
  { to: "/app/settings", label: "Settings", Icon: IconSettings },
];

export default function Layout() {
  return (
    <>
      <QuickExit />
      <Outlet />
      <nav className="nav">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
