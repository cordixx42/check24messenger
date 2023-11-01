import socketIO from "socket.io-client";
import React from "react";

const url = "http://localhost:3001";
export const socket = socketIO.connect(url);
export const SocketContext = React.createContext();
