import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const ChatOverview = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", userName);
    navigate("/chat");
  };

  return <h1> This should be overview page of all chats </h1>;
};
