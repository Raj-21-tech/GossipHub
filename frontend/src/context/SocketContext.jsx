import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:5001"); // backend port
    return () => socket.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
