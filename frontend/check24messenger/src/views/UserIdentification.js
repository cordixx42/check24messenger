import { useNavigate, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Button,
  StyledContainer,
  LoginInputField,
  Column,
} from "../style/components";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Test } from "./TestView";

export const UserIdentification = ({}) => {
  const navigate = useNavigate();
  // <Routes>
  //   <Route path="/test" element={<Test />} />
  // </Routes>;
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("customer");

  const options = ["customer", "service-provider"];
  const defaultOption = options[0];

  useEffect(() => {
    console.log("effect");
  }, []);

  const handleSubmit = (e) => {
    console.log(userName);
    console.log(userType);

    const ut = userType == "customer" ? 0 : 1;

    fetch(
      "http://localhost:3001/identification/?name=" + userName + "&type=" + ut
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          localStorage.setItem("userName", userName);
          localStorage.setItem("userType", userType);
          // TODO problem when refreshing page socket also disconnects and reconnects
          // socket.emit("initialIdentfication", {
          //   socketId: socket.id,
          //   userName: userName,
          //   userType: ut,
          // });
          navigate("/" + userName + ut);
        } else {
          navigate("/notfound");
        }
      });

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

  const handleTest = (e) => {
    navigate("/test");
  };
  return (
    <StyledContainer>
      <Column>
        <h1> Welcome to the CHECK24 Web Messenger </h1>
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
        <Button onClick={handleSubmit}>submit</Button>
        <Button onClick={handleTest}>test</Button>
      </Column>
    </StyledContainer>
  );
};
