import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, MessageInputField } from "../style/components";
import { Row, Column } from "../style/components";
import styled from "styled-components";

const OverRideButton = styled(Button)`
  border: 4px solid #4fbfa3;
`;

const MessageBox = styled.div`
  font-size: 15px;
  padding: 15px;
  margin: 10px;
  align-items: center;
  border-radius: 7px;
`;

export const SingleChat = ({ socket }) => {
  const navigate = useNavigate();

  const { conversation } = useParams();

  const convId = parseInt(conversation.split(".")[0]);
  //consider saving in localstorage
  const userType = parseInt(conversation.split(".")[1]);
  const userTypeName = userType ? "service_provider" : "customer";

  const [messages, setMessages] = useState([]);

  const [receivedMessages, setReceivedMessages] = useState([]);

  const [currentMessage, setCurrentMessage] = useState("");

  const handleCurrentMessage = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSend = (e) => {
    console.log(currentMessage);
    socket.emit("sendMessage", {
      convId: convId,
      userType: userType,
      text: currentMessage,
    });
    setCurrentMessage("");
  };

  useEffect(() => {
    fetch("http://localhost:3001/messages/?convId=" + convId)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log(data);
      setReceivedMessages((oldArray) => [...oldArray, data]);
    });
  }, [socket]);

  return (
    <>
      <h1>
        This should be overview {conversation} of one single chat with convId
        {convId} and type {userTypeName}
      </h1>
      <Row style={{ alignSelf: "center" }}>
        <MessageInputField
          value={currentMessage}
          onChange={handleCurrentMessage}
        ></MessageInputField>
        <OverRideButton onClick={handleSend}>send</OverRideButton>
      </Row>
      {/* TODO does not work yet */}
      {receivedMessages &&
        receivedMessages.map((mess) => {
          <li>{mess.text}</li>;
        })}
      <Button>separator</Button>
      {messages &&
        messages.map((mess) => {
          if (mess.sender_type == userTypeName) {
            return (
              <MessageBox style={{ background: "#fabf87", alignSelf: "end" }}>
                {mess.text}
                #####
                {new Date(Date.parse(mess.created_at)).toLocaleString()}
              </MessageBox>
            );
          } else {
            return (
              <MessageBox style={{ background: "#94a895", alignSelf: "start" }}>
                {mess.text}
                #####
                {new Date(Date.parse(mess.created_at)).toLocaleString()}
              </MessageBox>
            );
          }
        })}
    </>
  );
};

// not go through router but directly child component
export const SingleChatChild = ({ convId, userType, messages }) => {
  const conv = convId;
  //consider saving in localstorage
  const user = userType;

  console.log("message");
  console.log(messages);

  return (
    <>
      <h1>
        This should be overview of one single chat with convId
        {conv} and type {user}
      </h1>

      {messages &&
        messages.map((mess) => {
          <li>{mess.text}</li>;
        })}
    </>
  );
};

//this works -> base case
export const StaticChat = ({ messages }) => {
  console.log("heyy static");
  console.log(messages);
  return <>{messages && messages.map((mess) => <li>{mess.text}</li>)};</>;
};
