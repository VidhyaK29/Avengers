import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, LogOut } from "lucide-react";
import "./Header.scss";

interface HeaderProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuthenticated }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch customer data from sessionStorage
  const customerData = JSON.parse(sessionStorage.getItem("customerData") || "{}");

  // Extract user details, fallback to default
  const userEmail = customerData?.email || "avengers@gmail.com";
  const userName = customerData?.name || userEmail.split("@")[0];
  const avatarText = userName.slice(0, 2).toUpperCase();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/assets/Jarvis.png"></img>
      </div>
      <div className="header-right">
        <div className="icons">
          <Bell size={24} className="cursor-pointer" />
          <Settings size={24} className="cursor-pointer" />
          <LogOut size={24} className="cursor-pointer" onClick={handleLogout} />
          <img
            src="/assets/user.png"
            width="32"
            height="32"
            alt="User Profile"
            title={userName}
            className="w-8 h-8 rounded-full border border-white userProfile cursor-pointer"
            onClick={() => setShowPopup(!showPopup)}
          />
        </div>

        {/* User Profile Popup */}
        {showPopup && (
          <div className="user-popup" ref={popupRef}>
            <div className="popup-header">
              <div className="avatar">
                <span className="avatar-text">{avatarText}</span>
                <h3>{userName}</h3>
              </div>
              <div className="user-info">
                <div>{userEmail}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
