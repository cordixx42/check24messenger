import logo from "./logo.svg";
import "./App.css";
//import { socket } from "./socket";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import socketIO from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatOverview } from "./views/ChatOverview";
import { SingleChat } from "./views/SingleChat";
import { UserIdentification } from "./views/UserIdentification";

const url = "http://localhost:3001";

const socket = socketIO.connect(url);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserIdentification />}></Route>
        <Route path="/chat" element={<SingleChat />}></Route>
        <Route path="/:user" element={<ChatOverview />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
