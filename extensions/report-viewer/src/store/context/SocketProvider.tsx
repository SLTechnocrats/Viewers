import React, {createContext, ReactNode, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {SOCKET_SERVER_URL} from "@/api/api";

// Create the context with an initial value of null
export const SocketContext = createContext<Socket | null>(null);

// Define props for the SocketProvider, which includes children
interface SocketProviderProps {
    children: ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [timestamp, setTimestamp] = useState(Date.now());

    useEffect(() => {
        // Create the socket instance with reconnection options
        const socketInstance = io(SOCKET_SERVER_URL,{path:"/socket.io",transports:["websocket"],secure:true});
        // Set the socket instance in state
        setSocket(socketInstance);

        // Listen for socket disconnection
        socketInstance.on("disconnect", (reason) => {
            console.warn("Socket disconnected:", reason);
            setSocket(null);
            setTimestamp(Date.now());
        });

        // Listen for successful reconnection and reset socket instance
        socketInstance.on("reconnect", (attempt) => {
            console.log("Socket reconnected after", attempt, "attempt(s)");
            setSocket(socketInstance); // Reset the socket in context after reconnection
        });

        // Error handler
        socketInstance.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        // Cleanup on component unmount
        return () => {
            socketInstance.disconnect();
        };
    }, [timestamp]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
