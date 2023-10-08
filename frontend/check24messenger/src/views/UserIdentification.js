import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  StyledContainer,
  InputField,
  Column,
} from "../style/components";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export const UserIdentification = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");

  const options = ["customer", "service-provider"];
  const defaultOption = options[0];

  const handleSubmit = (e) => {
    console.log(userName);
    console.log(userType);
    // e.preventDefault();
    // localStorage.setItem("userName", userName);
    // navigate("/chat");
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
        <h1> Welcome to the CHECK24 Web Messenger </h1>
        <InputField
          placeholder="Please enter your name"
          onChange={handleName}
        ></InputField>
        <Dropdown
          options={options}
          onChange={handleUserType}
          value={defaultOption}
          placeholder="Select what user type you are"
        />
        <Button onClick={handleSubmit}>submit</Button>
      </Column>
    </StyledContainer>
  );
};
