import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Default = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1>This should be default view of chat area </h1>
        <li> introduction of the messenger app </li>
        <li> purpose </li>
      </div>

      <div>second fragment</div>
    </>
  );
};
