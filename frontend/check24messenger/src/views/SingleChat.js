import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { Button, MessageInputField, SimpleBox } from "../style/components";
import { Row, Column } from "../style/components";
import styled from "styled-components";
import { socket } from "../socket";

const OverRideButton = styled(Button)`
  border: 4px solid #4fbfa3;
`;

const MessageFrame = styled(Column)`
  background-color: #b4c4ce;
  overflow-y: scroll;
  width: 100%;
  border-radius: 10px;
`;

const MessageBox = styled.div`
  background: greenyellow;
  font-size: 15px;
  padding: 15px;
  margin: 10px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
`;

const InnerBox = styled.div`
  padding-top: 10px;
  font-size: 11px;
  align-self: flex-end;
`;

export const SingleChat = () => {
  const { conversation } = useParams();

  const convId = parseInt(conversation.split(".")[0]);
  //consider saving in localstorage
  const userType = parseInt(conversation.split(".")[1]);
  const userTypeName = userType ? "service_provider" : "customer";

  const [conversationState, setConversationState] = useState("");

  const [otherUser, setOtherUser] = useState(null);

  const [messages, setMessages] = useState([]);

  const [currentMessage, setCurrentMessage] = useState("");

  const [receivedMessage, setReceivedMessage] = useState("");

  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState("");

  const [messageType, setMessageType] = useState("");

  const handleCurrentMessage = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleFile = (e) => {
    if (e.target.files) {
      console.log(e.target.files);
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBase64(e.target.result);
        console.log(base64);
      };
      console.log(file);
      reader.readAsDataURL(file);
    }
  }, [file]);

  //TODO case if file is image, maybe limit images to png and jpg
  const base64toBlob = (data) => {
    var contentType;

    console.log(data);
    if (data.includes("application/pdf")) {
      console.log("pdf");
      contentType = "application/pdf";
    } else if (data.includes("image/jpeg")) {
      console.log("jpg");
      contentType = "image/jpeg";
    } else if (data.includes("image/png")) {
      console.log("png");
      contentType = "image/png";
    }

    //const pdfContentType = "application/pdf";
    const base64WithoutPrefix = data.substr(
      `data:${contentType};base64,`.length
    );
    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);
    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }
    return new Blob([out], { type: contentType });
  };

  const handleSend = (e) => {
    console.log(currentMessage);
    var mt = messageType;
    //customer implicit standard message
    if (mt == "" && userType == 0) {
      mt = "standard_message";
    }

    const withFile = base64 != "";

    socket.emit("sendSingleMessage", {
      convId: convId,
      userType: userType,
      text: currentMessage,
      date: new Date(),
      message_type: mt,
      withFile: withFile,
      fileBase64: base64,
    });
    setCurrentMessage("");
    setFile(null);
    setBase64("");
  };

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
    socket.on("receiveConversationState", (data) => {
      setConversationState(data);
    });

    socket.on("receiveOtherUser", (data) => {
      setOtherUser(data);
    });
  }, [socket]);

  //TODO
  useEffect(() => {
    socket.emit("getConversationState", { convId: convId });
    socket.emit("getAllMessages", { convId: convId });
    console.log("after emit " + convId);
  }, []);

  useEffect(() => {
    socket.emit("getOtherUser", { convId: convId, userType: userType });
  }, []);

  const s = useRef(null);
  useEffect(() =>
    s.current.scrollIntoView({ behavior: "smooth", block: "end" })
  );

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

  function handleNewLines(t) {
    const text = t;
    const newText = text.split("\n").map((str) => <p>{str}</p>);
    return newText;
  }

  return (
    <>
      {/* <h1 class="unique-component">
        This should be overview {conversation} of one single chat with convId
        {convId} and type {userTypeName} and conversation state{" "}
        {conversationState} with instance number{" "}
        {document.querySelectorAll(".unique-component").length}
      </h1> */}

      {/* <MessageBox>{receivedMessage}</MessageBox>
      <Button
        onClick={() =>
          scrollRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      >
        scroll down
      </Button> */}
      <Row style={{ width: "100%", justifyContent: "space-between" }}>
        <SimpleBox style={{ background: "#94a895", border: "2px solid black" }}>
          {otherUser &&
            (userType
              ? otherUser.customer_name
              : otherUser.service_provider_name)}
        </SimpleBox>
        <SimpleBox style={{ background: "#fabf87", border: "2px solid black" }}>
          {otherUser &&
            (userType
              ? otherUser.service_provider_name
              : otherUser.customer_name)}
        </SimpleBox>
      </Row>
      <MessageFrame>
        {messages &&
          messages.map((mess) => {
            if (mess.sender_type == userTypeName) {
              // console.log(mess.base64_file);
              var fileUrl;
              mess.base64_file != "" &&
                (fileUrl = URL.createObjectURL(base64toBlob(mess.base64_file)));
              return (
                <MessageBox
                  style={{
                    background: "#fabf87",
                    alignSelf: "end",
                  }}
                >
                  {mess.base64_file != "" && (
                    <a href={fileUrl}>
                      <img src={fileUrl} height="200" />
                    </a>
                  )}
                  {mess.text}
                  <InnerBox>
                    {new Date(Date.parse(mess.created_at)).toLocaleString()}
                  </InnerBox>
                </MessageBox>
              );
            } else {
              var fileUrl;
              mess.base64_file != "" &&
                (fileUrl = URL.createObjectURL(base64toBlob(mess.base64_file)));
              return (
                <MessageBox
                  style={{ background: "#94a895", alignSelf: "start" }}
                >
                  {mess.base64_file != "" && (
                    <a href={fileUrl}>
                      <img src={fileUrl} height="200" />
                    </a>
                  )}
                  {mess.text}
                  <InnerBox>
                    {new Date(Date.parse(mess.created_at)).toLocaleString()}
                  </InnerBox>
                </MessageBox>
              );
            }
          })}
        <div ref={s}></div>
      </MessageFrame>
      {/* blend out input field if state rejected */}
      {conversationState != "rejected" &&
        //blend out if provider and last message has been a quote
        !(
          userType == 1 &&
          messages[messages.length - 1] &&
          messages[messages.length - 1].message_type == "quote_offer"
        ) && (
          <Row style={{ alignSelf: "center" }}>
            <MessageInputField
              value={currentMessage}
              onChange={handleCurrentMessage}
            ></MessageInputField>
            <Column>
              {file && <img src={URL.createObjectURL(file)} height="150" />}
              <input
                id="file"
                type="file"
                accept=".pdf, .jpg, .png"
                onChange={handleFile}
              />
              {/* {base64 != "" && (
                <img
                  src={URL.createObjectURL(base64toBlob(base64))}
                  height="150"
                />
              )} */}
            </Column>

            {conversationState == "quoted" && userType == 0 && (
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
            {conversationState == "quoted" && userType == 1 && (
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
            <OverRideButton onClick={handleSend}>send</OverRideButton>
          </Row>
        )}

      {/* <Row style={{ width: "100%", justifyContent: "space-between" }}>
        <SimpleBox style={{ background: "#94a895", border: "2px solid black" }}>
          you
        </SimpleBox>
        <SimpleBox style={{ background: "#fabf87", border: "2px solid black" }}>
          me
        </SimpleBox>
      </Row> */}
    </>
  );
};
