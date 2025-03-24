import React, { useContext, useEffect, useMemo } from "react";
import { WebSocketContext } from "../context/WebSocketProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

interface WebSocketContextType {
    messages: string[];
}

const NotificationComponent: React.FC = () => {
    const context = useContext(WebSocketContext) as WebSocketContextType | null;

    // Memoizing messages to ensure stable reference
    const messages = useMemo(() => context?.messages ?? [], [context?.messages]);

    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            customFunction(latestMessage);
        }
    }, [messages]);

    const customFunction = (message: string) => {
        console.log(message);
    };

    return <></>;
};

export default NotificationComponent;
