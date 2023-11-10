import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatOverview } from "./views/ChatOverview";
import { UserIdentification } from "./views/UserIdentification";
import { NotFound } from "./views/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserIdentification />}></Route>
        <Route path="/:userinfo/*" element={<ChatOverview />}></Route>
        <Route path="/notfound" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
