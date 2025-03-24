import React, { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const serverUrl = "ws://34.217.6.27:8080"; // Replace with your WebSocket URL

    useEffect(() => {
        const socket = new WebSocket(serverUrl);

        socket.onopen = () => {
            console.log("✅ WebSocket Connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 Message received:", data.message);
            setMessages((prev) => [...prev, data.message]);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket Disconnected");
        };

        return () => socket.close(); // Cleanup on unmount
    }, []);


    return (
        <WebSocketContext.Provider value={{ messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};
