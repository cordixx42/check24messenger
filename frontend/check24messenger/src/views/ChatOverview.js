import { useNavigate, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { Column, Row, Button, SimpleBox } from "../style/components";
import { styled } from "styled-components";
import { Default } from "./DefaultView";
import { Chat } from "./Chat";
import { socket } from "../socket";

const RowWithoutGap = styled(Row)`
  gap: 0px;
`;

const ConversationBar = styled(Column)`
  height: 100vh;
  width: 20vw;
  background-color: #c5c8f6;
  overflow-y: scroll;

  /* border-radius: 7px; */
`;

const DetailedChatArea = styled(Column)`
  height: 100vh;
  width: 80vw;
  background-color: #587e96;
  overflow: visible;
  // overflow-y: scroll;

  /* border-radius: 7px; */
`;

const ConversationBox = styled(SimpleBox)`
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: lightblue;
  }
`;

export const ChatOverview = () => {
  const navigate = useNavigate();

  const { userinfo } = useParams();
  const userName = userinfo.slice(0, userinfo.length - 1);
  // 0 -> customer, 1 -> service-provider
  const userType = parseInt(userinfo.at(userinfo.length - 1));

  const [conversations, setConversations] = useState([]);

  const [currentConv, setCurrentConv] = useState(-1);

  useEffect(() => {
    socket.connect();
  }, []);

  //initial identification now here, mounting triggers reidentifying
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected with id " + socket.id);
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

  useEffect(() => {
    console.log("chatoverview mounting");
    return () => {
      console.log("chatoverview unmounting");
    };
  }, []);

  const handleConversation = (convId) => {
    if (currentConv != convId) {
      console.log("switch to conversation");
      setCurrentConv(convId);
      navigate("/" + userinfo + "/" + convId + "." + userType);
    }
  };

  const handleDefault = () => {
    console.log("here " + currentConv);
    if (currentConv != 0) {
      console.log("switch to profiles");
      setCurrentConv(0);
      navigate("/" + userinfo);
    }
  };

  const handleBye = () => {
    navigate("/");
  };

  //unread messages of current conv
  const [unreadMessageIds, setUnreadMessageIds] = useState([]);

  const handleUnreadMessages = useCallback(
    (messId) => {
      console.log("handleUnread called in chatoverview with messid " + messId);
      if (unreadMessageIds.indexOf(messId) == -1) {
        console.log("doesnt exist in ids");
        unreadMessageIds[unreadMessageIds.length] = messId;
        console.log("unreadIds " + unreadMessageIds);
      }
    },
    [unreadMessageIds]
  );

  //update server database that was read changed
  useEffect(() => {
    console.log("before socket unread");
    console.log("unreadIds length" + unreadMessageIds.length);
    if (unreadMessageIds.length > 0) {
      console.log("unread array not empty " + unreadMessageIds);
      socket.emit("unreadUpdate", unreadMessageIds);
      setUnreadMessageIds([]);
    }
  }, [currentConv]);

  return (
    <>
      <RowWithoutGap>
        <ConversationBar>
          <div
            style={{
              fontSize: "35px",
              paddingTop: "20px",
              textAlign: "center",
            }}
          >
            <b>{userName.toUpperCase()}</b>
          </div>

          <div style={{ fontSize: "30px", textAlign: "center" }}>
            <i>{userType ? "Service Provider" : "Customer"}</i>
          </div>

          <Button
            style={{ fontSize: "20px", borderRadius: "20px" }}
            onClick={handleDefault}
          >
            PROFILE
          </Button>
          <Button
            style={{ fontSize: "15px", borderRadius: "20px" }}
            onClick={handleBye}
          >
            LOGOUT
          </Button>
          <h1>CHATS</h1>
          {conversations &&
            conversations.map((conv) => (
              <ConversationBox
                key={conv.id}
                onClick={() => {
                  console.log(conv.id + "was clicked ");
                  handleConversation(conv.id);
                }}
              >
                {console.log("hihhih")}
                {userType
                  ? conv.customer_name.toUpperCase()
                  : conv.service_provider_name.toUpperCase()}
              </ConversationBox>
            ))}
        </ConversationBar>
        <DetailedChatArea>
          <Routes>
            <Route path="" element={<Default />} />
            <Route
              path=":conversation"
              element={
                <Chat
                  key={currentConv}
                  handleUnreadMessages={handleUnreadMessages}
                />
              }
            />
          </Routes>
        </DetailedChatArea>
      </RowWithoutGap>
    </>
  );
};
