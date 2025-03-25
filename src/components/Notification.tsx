import React, { useContext, useEffect, useMemo } from "react";
import { WebSocketContext } from "../context/WebSocketProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

interface WebSocketMessage {
  id: string;
  message: string;
  timestamp: string;
  agent: string; // Add agent
  requestId: string; // Add requestId
}

interface WebSocketContextType {
  context: WebSocketMessage[];
}

interface NotificationComponentProps {
  setFetchEmails: (requestId?: string) => void; // Accept optional requestId
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ setFetchEmails }) => {
  const context = useContext(WebSocketContext) as WebSocketContextType | null;

  const messages = useMemo(() => context?.context ?? [], [context?.context]);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      customFunction(latestMessage);
    }
  }, [messages]);

  const customFunction = (message: WebSocketMessage) => {
    console.log("Latest Message:", message);
    toast(message.message); // Display the message content as a toast notification
    
    if (message.agent === "email_agent") {
      setFetchEmails(message.requestId); // Pass the requestId if agent is email_agent
    }
  };

  return <></>; // No UI rendered, just side effects
};

export default NotificationComponent;
