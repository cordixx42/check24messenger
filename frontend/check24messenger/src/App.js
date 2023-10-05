import logo from "./logo.svg";
import "./App.css";
//import { socket } from "./socket";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import socketIO from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

const socket = socketIO.connect("http://localhost:3001");

function App() {
  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);
  //   socket.on("FromAPI", (data) => {});
  // }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
