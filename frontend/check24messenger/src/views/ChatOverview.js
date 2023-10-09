import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";

export const ChatOverview = () => {
  const navigate = useNavigate();

  const { user } = useParams();
  const userName = user.slice(0, user.length - 1);
  // 0 -> customer, 1 -> service-provider
  const userType = parseInt(user.at(user.length - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/chat");
  };

  return (
    <h1>
      This should be overview page of all chats of user "{user}" with name "
      {userName}" and type "{userType}"
    </h1>
  );
};
