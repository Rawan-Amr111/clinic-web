import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  ChartNoAxesColumn,
  ClipboardPlus,
  LayoutDashboard,
  Settings,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import classes from "./index.module.css";
import { PlusSquareFilled } from "@ant-design/icons";
const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Live Queue", path: "/live-queue", icon: ClipboardPlus },
  { label: "Appointments", path: "/appointments", icon: CalendarDays },
  { label: "Doctors", path: "/doctors", icon: Stethoscope },
  { label: "Patients", path: "/patients", icon: UsersRound },
  { label: "Analytics", path: "/analytics", icon: ChartNoAxesColumn },
  { label: "Settings", path: "/settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className={classes.sidebar}>
      <div className={classes["brand-header"]}>
        <div className={classes["brand-icon-box"]}>
          <PlusSquareFilled className={classes["brand-icon"]} />
        </div>
        <div className={classes["brand-text"]}>
          <span className={classes["brand-title"]}>ClinicFlow</span>
          <span className={classes["brand-subtitle"]}>Healthcare Admin</span>
        </div>
      </div>

      <nav className={classes["nav-list"]}>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `${classes["nav-link"]} ${isActive ? classes.active : ""}`
                  }
                >
                  <span className={classes["icon-wrapper"]}>
                    <Icon size={19} />
                  </span>

                  <span className={classes["link-text"]}>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
