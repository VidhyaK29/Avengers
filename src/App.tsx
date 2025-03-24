import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./App.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import EmailInbox from "./components/Email/EmailInbox";
import EmailDetails from "./components/Email/EmailDetails";
import { Email } from "./interfaces/common.interface";
import Dashboard from "./components/Dashbaord/Dashboard";
import Header from "./components/Header/Header";
import NewEmail from "./components/Email/NewEmail";
import { WebSocketProvider } from "./context/WebSocketProvider";
import NotificationComponent from "./components/Notification";
import Login from "./components/Login/Login";
import Graph from "./components/Graph/Graph";

const App: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [fetchEmails, setFetchEmails] = useState<() => void>(() => {});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(sessionStorage.getItem("userId")));

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(Boolean(sessionStorage.getItem("userId")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Check if the current route is login
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return (
      <Login
        onLogin={() => {
          setIsAuthenticated(true);
          navigate("/dashboard", { state: { fromLogin: true } });
        }}
      />
    );
  }

  return (
    <div className="app">
      <Header setIsAuthenticated={setIsAuthenticated} />
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <WebSocketProvider>
            <NotificationComponent />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/graph" element={<Graph />} />

              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/email" element={<NewEmail />} /> */}
              <Route
                path="/inbox"
                element={
                  <div className="email-layout">
                    <EmailInbox
                      onSelectEmail={(email, draft) => {
                        setSelectedEmail(email);
                        setIsDraft(draft);
                      }}
                      setFetchEmails={setFetchEmails}
                    />
                    <EmailDetails email={selectedEmail} isDraft={isDraft} refreshEmails={fetchEmails} />
                  </div>
                }
              />
            </Routes>
          </WebSocketProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
