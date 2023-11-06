import socketIO from "socket.io-client";
import React from "react";
import { io } from "socket.io-client";

const url = "http://localhost:3001";
export const socket = socketIO(url, {
  autoConnect: false,
});
// export const SocketContext = React.createContext();
