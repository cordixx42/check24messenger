import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { Button, MessageInputField, SimpleBox } from "../style/components";
import { Row, Column } from "../style/components";
import styled from "styled-components";
import { socket } from "../socket";
import r1 from "../imgs/review1.jpeg";
import r2 from "../imgs/review2.jpeg";
import r3 from "../imgs/review3.jpeg";
import r4 from "../imgs/review4.jpeg";
import r5 from "../imgs/review5.jpeg";

const OverRideButton = styled(Button)`
  border: 4px solid #4fbfa3;
`;

const MessageFrame = styled(Column)`
  background-color: #d7e2e2;
  overflow-y: scroll;
  width: 100%;
  border-radius: 10px;
  height: 80%;
`;

const MessageBox = styled.div`
  background: whitesmoke;
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
  const otherUserTypeName = userType ? "customer" : "service_provider";

  const [review, setReview] = useState(-1);

  const [conversationState, setConversationState] = useState("");

  const [otherUser, setOtherUser] = useState("");

  const [me, setMe] = useState("");

  const [messages, setMessages] = useState([]);

  const [currentMessage, setCurrentMessage] = useState("");

  const [receivedMessage, setReceivedMessage] = useState("");

  const [acceptMessageDate, setAcceptMessageDate] = useState("");

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
    //implicit standard message
    if (mt == "") {
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
    setMessageType("");
  };

  useEffect(() => {
    socket.on("receiveAllMessages", (data) => {
      console.log("received initial messages");
      console.log(data);
      setMessages(data);
    });
    socket.on("receiveSingleMessage", (data) => {
      console.log(data);
      setReceivedMessage(data.text);
      setMessages((before) => [...before, data]);
    });

    socket.on("receiveReview", (data) => {
      console.log("review is " + data);
      setReview(data);
    });

    socket.on("receiveConversationState", (data) => {
      setConversationState(data);
    });

    socket.on("receiveConversationAccept", (data) => {
      console.log(data);
      setAcceptMessageDate(data);
    });

    socket.on("receiveOtherUser", (data) => {
      if (userType) {
        setOtherUser(data.customer_name);
        setMe(data.service_provider_name);
      } else {
        setOtherUser(data.service_provider_name);
        setMe(data.customer_name);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("getAllMessages", { convId: convId });
    socket.emit("getConversationData", { convId: convId });
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

  const handleReviewRequest = (e) => {
    socket.emit("reviewRequest", {
      convId: convId,
      userTypeName: userTypeName,
      date: new Date(),
      recipient: otherUser,
    });
  };

  const handleReviewAnswer = (score) => {
    console.log(score);
    socket.emit("reviewAnswer", {
      convId: convId,
      score: score,
      userTypeName: userTypeName,
      date: new Date(),
      recipient: otherUser,
    });
  };

  return (
    <>
      <h1>
        the conversation state is {conversationState} and accepted at{" "}
        {acceptMessageDate} with review {review}
      </h1>

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
        <SimpleBox
          style={{
            fontSize: "20px",
            background: "#94a895",
            border: "2px solid black",
          }}
        >
          {otherUser && otherUser.toUpperCase()}
        </SimpleBox>
        <SimpleBox
          style={{
            fontSize: "20px",
            background: "#fabf87",
            border: "2px solid black",
          }}
        >
          ME
        </SimpleBox>
      </Row>
      <MessageFrame>
        {messages &&
          messages.map((mess) => {
            if (review > 0 && mess.message_type == "review_request") {
            } else {
              if (mess.sender_type == userTypeName) {
                // console.log(mess.base64_file);
                var fileUrl;
                mess.base64_file != "" &&
                  (fileUrl = URL.createObjectURL(
                    base64toBlob(mess.base64_file)
                  ));
                return (
                  <MessageBox
                    key={mess.id}
                    style={{
                      alignSelf: "end",
                    }}
                  >
                    {mess.message_type == "quote_offer" && (
                      <b
                        style={{
                          color: "blue",
                          alignSelf: "center",
                          padding: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        you posted quote offer
                      </b>
                    )}
                    {mess.message_type == "accept_quote_message" && (
                      <b
                        style={{
                          color: "green",
                          alignSelf: "center",
                          padding: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        you accepted the quote
                      </b>
                    )}
                    {mess.message_type == "reject_quote_message" && (
                      <b
                        style={{
                          color: "red",
                          alignSelf: "center",
                          padding: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        you rejected the quote
                      </b>
                    )}
                    {mess.message_type == "review_request" && (
                      <Column>
                        <i
                          style={{
                            color: "black",
                            alignSelf: "center",
                            padding: "5px",
                          }}
                        >
                          you requested a review from {otherUserTypeName}{" "}
                          {otherUser}
                        </i>
                        <Row>
                          <img src={r1} height="40" />
                          <img src={r2} height="40" />
                          <img src={r3} height="40" />
                          <img src={r4} height="40" />
                          <img src={r5} height="40" />
                        </Row>
                      </Column>
                    )}
                    {mess.message_type == "review_answer" && (
                      <Column>
                        <i
                          style={{
                            color: "black",
                            alignSelf: "center",
                            padding: "5px",
                          }}
                        >
                          you rated {otherUserTypeName} {otherUser}'s service
                          with {review}/5
                        </i>
                        {review == 1 ? (
                          <img src={r1} height="40" />
                        ) : review == 2 ? (
                          <img src={r2} height="40" />
                        ) : review == 3 ? (
                          <img src={r3} height="40" />
                        ) : review == 4 ? (
                          <img src={r4} height="40" />
                        ) : review == 5 ? (
                          <img src={r5} height="40" />
                        ) : (
                          <b>error</b>
                        )}
                      </Column>
                    )}
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
                  (fileUrl = URL.createObjectURL(
                    base64toBlob(mess.base64_file)
                  ));
                return (
                  <MessageBox key={mess.id} style={{ alignSelf: "start" }}>
                    {mess.message_type == "quote_offer" && (
                      <b
                        style={{
                          color: "blue",
                          alignSelf: "center",
                          padding: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        {otherUserTypeName} {otherUser} posted quote offer
                      </b>
                    )}
                    {mess.message_type == "accept_quote_message" && (
                      <b
                        style={{
                          color: "green",
                          alignSelf: "center",
                          padding: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        {otherUserTypeName} {otherUser} accepted the quote
                      </b>
                    )}
                    {mess.message_type == "reject_quote_message" && (
                      <b
                        style={{
                          color: "red",
                          alignSelf: "center",
                          padding: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        {otherUserTypeName} {otherUser} rejected the quote
                      </b>
                    )}
                    {mess.message_type == "review_request" && (
                      <Column>
                        <i
                          style={{
                            color: "black",
                            alignSelf: "center",
                            padding: "5px",
                          }}
                        >
                          {otherUserTypeName} {otherUser} kindly asks you for a
                          review
                        </i>
                        <Row>
                          <img
                            src={r1}
                            height="40"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReviewAnswer(1)}
                          />
                          <img
                            src={r2}
                            height="40"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReviewAnswer(2)}
                          />
                          <img
                            src={r3}
                            height="40"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReviewAnswer(3)}
                          />
                          <img
                            src={r4}
                            height="40"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReviewAnswer(4)}
                          />
                          <img
                            src={r5}
                            height="40"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReviewAnswer(5)}
                          />
                        </Row>
                      </Column>
                    )}
                    {mess.message_type == "review_answer" && (
                      <Column>
                        <i
                          style={{
                            color: "black",
                            alignSelf: "center",
                            padding: "5px",
                          }}
                        >
                          {otherUserTypeName} {otherUser} rated your service
                          with {review}
                          /5
                        </i>

                        {review == 1 ? (
                          <img src={r1} height="40" />
                        ) : review == 2 ? (
                          <img src={r2} height="40" />
                        ) : review == 3 ? (
                          <img src={r3} height="40" />
                        ) : review == 4 ? (
                          <img src={r4} height="40" />
                        ) : review == 5 ? (
                          <img src={r5} height="40" />
                        ) : (
                          <b>error</b>
                        )}
                      </Column>
                    )}
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
                <div style={{ color: "green" }}>
                  <input
                    type="radio"
                    value="accept_quote_message"
                    name="messagetype"
                  ></input>
                  accept offer
                </div>
                <div style={{ color: "red" }}>
                  <input
                    type="radio"
                    value="reject_quote_message"
                    name="messagetype"
                  ></input>
                  reject offer
                </div>
              </Column>
            )}
            {userType == 1 && conversationState == "quoted" && (
              <Column onChange={onChangeRadio}>
                <div>
                  <input
                    type="radio"
                    value="standard_message"
                    name="messagetype"
                  ></input>
                  normal message
                </div>
                <div style={{ color: "blue" }}>
                  <input
                    type="radio"
                    value="quote_offer"
                    name="messagetype"
                  ></input>
                  quote offer
                </div>
              </Column>
            )}

            {userType == 1 &&
              conversationState == "accepted" &&
              review == -1 &&
              Date.now() >
                new Date(Date.parse(acceptMessageDate)).getTime() +
                  604800000 && (
                <Button onClick={handleReviewRequest}>request review</Button>
              )}
            <OverRideButton onClick={handleSend}>send</OverRideButton>
          </Row>
        )}
    </>
  );
};
