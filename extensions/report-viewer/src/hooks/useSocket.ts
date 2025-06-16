import {useContext} from "react";
import {Socket} from "socket.io-client";
import {SocketContext} from "@/store/context/SocketProvider"; // Import the context from the provider

const useSocket = (): Socket | null => {
    return useContext(SocketContext);
};

export default useSocket;
