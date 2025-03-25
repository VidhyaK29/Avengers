import React, { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [context, setContext] = useState([]);
    const serverUrl = "ws://34.217.6.27:8080"; // Replace with your WebSocket URL

    useEffect(() => {
        const socket = new WebSocket(serverUrl);

        socket.onopen = () => {
            console.log("✅ WebSocket Connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 Message received:", data);
            setContext((prev) => [...prev, data]);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket Disconnected");
        };

        return () => socket.close(); // Cleanup on unmount
    }, []);


    return (
        <WebSocketContext.Provider value={{ context }}>
            {children}
        </WebSocketContext.Provider>
    );
};
