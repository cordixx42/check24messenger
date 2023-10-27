import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Column, Row, Button } from "../style/components";
import { styled } from "styled-components";
import { SingleChat, SingleChatChild, StaticChat } from "./SingleChat";
import { Outlet } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import socketIO from "socket.io-client";

const RowWithoutGap = styled(Row)`
  gap: 0px;
`;

const ConversationBar = styled(Column)`
  height: 100vh;
  width: 25vw;
  background-color: beige;
  justify-content: start;
  /* border-radius: 7px; */
`;

const ConversationBox = styled.div`
  background-color: #808fd9;
  font-size: 30px;
  padding: 15px;
  margin: 10px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: lightblue;
  }
  border-radius: 7px;
`;

const DetailedChatArea = styled(Column)`
  height: 100vh;
  width: 75vw;
  background-color: gray;

  /* border-radius: 7px; */
`;

const ProfileButton = styled(Button)`
  font-size: 30px;
`;

const url = "http://localhost:3001";

export const ChatOverview = ({ socket }) => {
  const navigate = useNavigate();

  const { userinfo } = useParams();
  const userName = userinfo.slice(0, userinfo.length - 1);
  // 0 -> customer, 1 -> service-provider
  const userType = parseInt(userinfo.at(userinfo.length - 1));

  const [conversations, setConversations] = useState([]);

  const [change, setChange] = useState(false);

  function sendMessage() {
    console.log("Button clicked");
    console.log(socket.id);
  }

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

  //TODO add conversation status too
  const handleConversation = (convId) => {
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
          <ProfileButton onClick={handleBye}>Goodbye</ProfileButton>
          <ProfileButton onClick={sendMessage}>sockettest</ProfileButton>
          <h1>My Conversations</h1>
          {conversations &&
            conversations.map((conv) => (
              <ConversationBox
                key={conv.id}
                onClick={() => {
                  handleConversation(conv.id);
                }}
              >
                {userType ? conv.customer_name : conv.service_provider_name}
              </ConversationBox>
            ))}
        </ConversationBar>
        <DetailedChatArea>
          <Outlet />
        </DetailedChatArea>
      </RowWithoutGap>
    </>
  );
};

// experimenting with differnet methods of rendering chat view
export const ChatOverviewChild = () => {
  const navigate = useNavigate();

  const { userinfo } = useParams();
  const userName = userinfo.slice(0, userinfo.length - 1);
  // 0 -> customer, 1 -> service-provider
  const userType = parseInt(userinfo.at(userinfo.length - 1));

  const [conversations, setConversations] = useState([]);

  const [messages, setMessages] = useState([]);

  // conversation id
  const [currentConv, setCurrentConv] = useState(0);

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
        console.log(data);
        console.log(conversations);
      });
  }, []);

  useEffect(() => {
    currentConv != 0 &&
      fetch("http://localhost:3001/messages/?convId=" + currentConv)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          console.log(data);
          console.log(messages);
        });
  }, [currentConv]);

  const handleConversation = (providerName, convId) => {
    console.log(providerName);
    //setCurrentConv(convId);
    navigate("/" + userinfo + "/" + convId + "." + userType);
  };

  const handleDefault = () => {
    navigate("/" + userinfo + "/default");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //navigate("/chat");
  };

  return (
    <>
      <h1>
        current user "{userinfo}" with name "{userName}" and type "{userType}"
      </h1>

      <Row>
        <ConversationBar>
          <ProfileButton onClick={handleDefault}>Profile</ProfileButton>
          <h1>Conversations go here</h1>
          {conversations &&
            conversations.map((conv) => (
              <ConversationBox
                key="{conv.id}"
                onClick={() =>
                  handleConversation(conv.service_provider_name, conv.id)
                }
              >
                {conv.service_provider_name}
              </ConversationBox>
            ))}
        </ConversationBar>
        <DetailedChatArea>
          <Outlet />
          {/* <SingleChatChild
            convId={currentConv}
            userType={userType}
            messages={messages}
            // setMessages={setMessages}
          /> */}
          {/* {messages &&
            messages.map((mess) => (
              <ConversationBox>{mess.text}</ConversationBox>
            ))} */}
          {/* <StaticChat messages={messages} /> */}
        </DetailedChatArea>
      </Row>
    </>
  );
};
