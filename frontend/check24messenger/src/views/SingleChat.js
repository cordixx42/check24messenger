import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { Button, MessageInputField } from "../style/components";
import { Row, Column } from "../style/components";
import styled from "styled-components";
import { SocketContext } from "../socket";

const OverRideButton = styled(Button)`
  border: 4px solid #4fbfa3;
`;

const MessageBox = styled.div`
  background: greenyellow;
  font-size: 15px;
  padding: 15px;
  margin: 10px;
  align-items: center;
  border-radius: 7px;
`;

export const SingleChat = ({}) => {
  const navigate = useNavigate();

  const socket = useContext(SocketContext);

  const { conversation } = useParams();

  const convId = parseInt(conversation.split(".")[0]);
  //consider saving in localstorage
  const userType = parseInt(conversation.split(".")[1]);
  const userTypeName = userType ? "service_provider" : "customer";

  const [conversationState, setConversationState] = useState("");

  const [messages, setMessages] = useState([]);

  const [currentMessage, setCurrentMessage] = useState("");
  //can be deleted
  const [receivedMessage, setReceivedMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const scrollRef = useRef();

  // const scroll = () => {
  //   scrollRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  // window.onload = function () {
  //   scrollRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  const handleCurrentMessage = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSend = (e) => {
    console.log(currentMessage);
    const mt = messageType;
    //customer implicit standard message
    if (mt == "" && userType == 0) {
      mt = "standard_message";
    }
    socket.emit("sendSingleMessage", {
      convId: convId,
      userType: userType,
      text: currentMessage,
      date: new Date(),
      message_type: messageType,
    });
    setCurrentMessage("");
    // scroll();
  };

  // not use REST but Websocket
  // useEffect(() => {
  //   fetch("http://localhost:3001/messages/?convId=" + convId)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMessages(data);
  //     });
  // }, []);

  useEffect(() => {
    socket.on("receiveAllMessages", (data) => {
      console.log("received initial messages");
      console.log(data);
      setMessages(data);
      // scroll();
    });
    socket.on("receiveSingleMessage", (data) => {
      console.log(data);
      // setReceivedMessages((oldArray) => [...oldArray, data]);
      setReceivedMessage(data.text);
      // console.log(messages.length);
      setMessages((before) => [...before, data]);
      // console.log(messages.length);
      // scroll();
    });
    //TODO
    socket.on("receiveConversationState", (data) => {
      setConversationState(data);
    });
  }, [socket]);

  //TODO
  useEffect(() => {
    socket.emit("getConversationState", { convId: convId });
    socket.emit("getAllMessages", { convId: convId });
    console.log("after emit " + convId);
  }, []);

  useEffect(() => {
    console.log("mounting" + convId);
    return () => {
      console.log("unmounting" + convId);
      setMessages([]);
    };
  }, []);

  const onChangeRadio = (e) => {
    console.log(e.target.value);
    setMessageType(e.target.value);
  };

  return (
    <>
      <h1 class="unique-component">
        This should be overview {conversation} of one single chat with convId
        {convId} and type {userTypeName} and conversation state{" "}
        {conversationState} with instance number{" "}
        {document.querySelectorAll(".unique-component").length}
      </h1>

      <MessageBox>{receivedMessage}</MessageBox>
      <Button
        onClick={() =>
          scrollRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      >
        scroll down
      </Button>
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
      {/* TODO blend out input field if user is provider and state rejected */}
      <Row style={{ alignSelf: "center" }}>
        <MessageInputField
          value={currentMessage}
          onChange={handleCurrentMessage}
          ref={scrollRef}
          // ref={scrollRef}
        ></MessageInputField>
        {userType == 0 && (
          <Column onChange={onChangeRadio}>
            <div>
              <input
                type="radio"
                value="standard_message"
                name="messagetype"
              ></input>
              normal message
            </div>
            <div>
              <input
                type="radio"
                value="accept_quote_message"
                name="messagetype"
              ></input>
              accept offer
            </div>
            <div>
              <input
                type="radio"
                value="reject_quote_message"
                name="messagetype"
              ></input>
              reject offer
            </div>
          </Column>
        )}
        {userType == 1 && (
          <Column onChange={onChangeRadio}>
            <div>
              <input
                type="radio"
                value="standard_message"
                name="messagetype"
              ></input>
              normal message
            </div>
            <div>
              <input
                type="radio"
                value="quote_offer"
                name="messagetype"
              ></input>
              quote offer
            </div>
          </Column>
        )}
        {messageType != "" && (
          <OverRideButton onClick={handleSend}>send</OverRideButton>
        )}
      </Row>
    </>
  );
};
