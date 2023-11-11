import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Button,
  StyledContainer,
  LoginInputField,
  Column,
} from "../style/components";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export const UserIdentification = ({}) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("customer");

  const options = ["customer", "service-provider"];
  const defaultOption = options[0];

  const handleSubmit = (e) => {
    console.log(userName);
    console.log(userType);

    const ut = userType == "customer" ? 0 : 1;

    fetch(
      "http://localhost:3001/identification/?name=" + userName + "&type=" + ut
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          navigate("/" + userName + ut);
        } else {
          navigate("/notfound");
        }
      });
  };

  const handleUserType = (e) => {
    setUserType(e.value);
  };

  const handleName = (e) => {
    if (e.target) {
      setUserName(e.target.value);
    }
  };

  return (
    <StyledContainer>
      <Column>
        <h1> Welcome to the CHECK24 Chat Messenger </h1>
        <LoginInputField
          placeholder="Please enter your name"
          onChange={handleName}
        ></LoginInputField>
        <Dropdown
          options={options}
          onChange={handleUserType}
          value={defaultOption}
          placeholder="Select what user type you are"
        />
        <Button onClick={handleSubmit}>LOGIN</Button>
      </Column>
    </StyledContainer>
  );
};
