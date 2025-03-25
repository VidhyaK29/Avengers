import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { Activity, LayoutDashboard, Mail } from "lucide-react";
import { authService } from "../../services/app.data.service"; // assuming you have an authservice file

const Sidebar: React.FC = () => {
  const userData = authService.getUserData(); // Get user data from sessionStorage

  return (
    <div className="sidebar">
      <ul>
        {/* Only show the Dashboard icon if userData exists */}
        {!userData && (
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              <LayoutDashboard size={16} className="icon" />
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/inbox" className={({ isActive }) => isActive ? "active" : ""}>
            <Mail size={16} className="icon" />
          </NavLink>
        </li>

        {/* Only show the Activity icon if userData exists */}
        {!userData && (
          <li>
            <NavLink to="/graph" className={({ isActive }) => isActive ? "active" : ""}>
              <Activity size={16} className="icon" /> {/* Graph Icon */}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
