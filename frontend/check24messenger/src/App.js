import logo from "./logo.svg";
import "./App.css";
//import { socket } from "./socket";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import socketIO from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatOverview, ChatOverviewChild } from "./views/ChatOverview";
import { SingleChat } from "./views/SingleChat";
import { UserIdentification } from "./views/UserIdentification";
import { Default } from "./views/DefaultView";
import { Button } from "./style/components";
import { socket } from "./socket";
import { NotFound } from "./views/NotFound";

function App() {
  return (
    // <SocketContext.Provider value={socket}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserIdentification />}></Route>
        <Route path="/:userinfo/*" element={<ChatOverview />}></Route>
        <Route path="/notfound" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
    // </SocketContext.Provider>
  );
}

export default App;
