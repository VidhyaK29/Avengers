import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { LayoutDashboard, Mail, MailPlus } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
          <LayoutDashboard size={16} className="icon" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/email" className={({ isActive }) => isActive ? "active" : ""}>
          <MailPlus size={16} className="icon" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/inbox" className={({ isActive }) => isActive ? "active" : ""}>
          <Mail size={16} className="icon" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
