import { useNavigate, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Column, Row, Button, SimpleBox } from "../style/components";
import { styled } from "styled-components";
import { Default } from "./DefaultView";
import { Outlet } from "react-router-dom";
import socketIO from "socket.io-client";
import { SingleChat } from "./SingleChat";
import { socket } from "../socket";

// const url = "http://localhost:3001";
// export const socket = socketIO.connect(url);

const RowWithoutGap = styled(Row)`
  gap: 0px;
`;

const ConversationBar = styled(Column)`
  height: 100vh;
  width: 25vw;
  background-color: beige;
  overflow-y: scroll;

  /* border-radius: 7px; */
`;

const DetailedChatArea = styled(Column)`
  height: 100vh;
  width: 75vw;
  background-color: #587e96;
  overflow: hidden;
  // overflow-y: scroll;

  /* border-radius: 7px; */
`;

const ConversationBox = styled(SimpleBox)`
  cursor: pointer;
  &:hover {
    background-color: lightblue;
  }
`;

const ProfileButton = styled(Button)`
  font-size: 30px;
`;

export const ChatOverview = () => {
  const navigate = useNavigate();

  const { userinfo } = useParams();
  const userName = userinfo.slice(0, userinfo.length - 1);
  // 0 -> customer, 1 -> service-provider
  const userType = parseInt(userinfo.at(userinfo.length - 1));

  const [conversations, setConversations] = useState([]);

  const [currentConv, setCurrentConv] = useState("");

  useEffect(() => {
    socket.connect();
  }, []);

  //initial identification now here, mounting triggers reidentifying
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected with id " + socket.id); // x8WIv7-mJelg7on_ALbx
      socket.emit("initialIdentfication", {
        socketId: socket.id,
        userName: userName,
        userType: userType,
      });
    });
  }, [socket]);

  useEffect(() => {
    fetch(
      "http://localhost:3001/conversations/?name=" +
        userName +
        "&type=" +
        userType
    )
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
      });
  }, []);

  const handleConversation = (convId) => {
    setCurrentConv(convId);
    navigate("/" + userinfo + "/" + convId + "." + userType);
  };

  const handleDefault = () => {
    navigate("/" + userinfo + "/default");
  };

  const handleBye = () => {
    navigate("/");
  };

  return (
    <>
      {/* <h1>
        This should be overview page of all chats of user "{userinfo}" with name
        "{userName}" and type "{userType}"
      </h1> */}

      <RowWithoutGap>
        <ConversationBar>
          <h1>{userName}</h1>
          <ProfileButton onClick={handleDefault}>Profile</ProfileButton>
          <ProfileButton style={{ fontSize: "15px" }} onClick={handleBye}>
            LogOut
          </ProfileButton>
          <h1>{userName}'s Chats</h1>
          {conversations &&
            conversations.map((conv) => (
              <ConversationBox
                key={conv.id}
                onClick={() => {
                  console.log(conv.id + "was clicked ");
                  handleConversation(conv.id);
                }}
              >
                {userType ? conv.customer_name : conv.service_provider_name}
              </ConversationBox>
            ))}
        </ConversationBar>
        <DetailedChatArea>
          {/* <Outlet /> */}
          <Routes>
            <Route
              path=":conversation"
              element={<SingleChat key={currentConv} />}
            />
            <Route path="default" element={<Default />} />
          </Routes>
        </DetailedChatArea>
      </RowWithoutGap>
    </>
  );
};
