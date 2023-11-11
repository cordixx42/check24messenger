import React from "react";
import { useRef, useEffect, useState } from "react";
import { Row, Column } from "../style/components";
import styled from "styled-components";
import r1 from "../imgs/review1.jpeg";
import r2 from "../imgs/review2.jpeg";
import r3 from "../imgs/review3.jpeg";
import r4 from "../imgs/review4.jpeg";
import r5 from "../imgs/review5.jpeg";

const MessageFrame = styled(Column)`
  background-color: #d7e2e2;
  overflow-y: scroll;
  width: 90%;
  border-radius: 10px;
  height: 90%;
  font-family: arial;
`;

const MessageBox = styled.div`
  background: whitesmoke;
  font-size: 17px;
  padding: 15px;
  margin: 10px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
  /* font-family: Arial, Helvetica, sans-serif; */
`;

const InnerBox = styled.div`
  padding-top: 15px;
  font-size: 13px;
  align-self: flex-end;
`;

const DateBox = styled.div`
  font-size: 17px;
  background: #b4b4b4;
  border-radius: 20px;
  padding: 10px;
  margin: 7px;
`;

const PaginationButton = styled.div`
  font-size: 30px;
  background: #c5c8f6;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  line-height: 25px;
  padding: 10px;
  margin-top: 15px;
  text-align: center;
  cursor: pointer;
`;

const maskSensibleInformation = (text) => {
  let emailPattern = /([\w-\.]+)@([\w-]+\.)+[\w-]{2,4}/g;

  let phonePattern =
    /[\+]?([(]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,10})/g;

  let urlPattern = /http\S*/g;

  var maskedText = text;

  const star = "*";

  var z;

  while (null != (z = emailPattern.exec(text))) {
    const len = z[1].length;
    maskedText = maskedText.replace(z[1], star.repeat(len));
  }

  while (null != (z = phonePattern.exec(text))) {
    const len = z[1].length;
    maskedText = maskedText.replace(z[1], star.repeat(len));
  }

  while (null != (z = urlPattern.exec(text))) {
    const len = z[0].length;
    maskedText = maskedText.replace(z[0], star.repeat(len));
  }

  return maskedText;
};

export const Messages = ({
  messages,
  userTypeName,
  otherUserTypeName,
  otherUser,
  review,
  handleReviewAnswer,
  base64toBlob,
  conversationState,
  handleUnreadMessages,
  removeUnreadTrigger,
  currentPage,
  handleNextPage,
  handlePrevPage,
  lastPage,
}) => {
  var firstUnreadId = -1;
  const [scrolled, setScrolled] = useState(false);
  const chatBottom = useRef(null);
  const unreadBottom = useRef(null);
  const realBottom = useRef(null);

  useEffect(() => {
    realBottom.current
      ? realBottom.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      : unreadBottom.current
      ? unreadBottom.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      : chatBottom.current &&
        chatBottom.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
  });

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (unreadBottom.current && bottom) {
      setScrolled(true);
    }
  };

  return (
    <MessageFrame onScroll={handleScroll}>
      <Row style={{ gap: "40px" }}>
        {currentPage != 0 && (
          <PaginationButton onClick={handlePrevPage}>&lt;</PaginationButton>
        )}
        {lastPage != currentPage && (
          <PaginationButton onClick={handleNextPage}>&gt;</PaginationButton>
        )}
      </Row>
      {messages &&
        messages.map((mess, idx) => {
          if (review > 0 && mess.message_type == "review_request") {
          } else {
            // set file url
            var fileUrl;
            mess.base64_file != "" &&
              (fileUrl = URL.createObjectURL(base64toBlob(mess.base64_file)));

            // if date changes
            var prevDate;
            var prevRead;
            if (idx > 0) {
              if (mess.message_type == "review_answer") {
                prevDate = new Date(Date.parse(messages[idx - 2].created_at));
              } else {
                prevDate = new Date(Date.parse(messages[idx - 1].created_at));
              }
              prevRead = messages[idx - 1].was_read == 1;
            }
            const thisDate = new Date(Date.parse(messages[idx].created_at));
            const thisRead = messages[idx].was_read == 1;

            // case message is  review answer
            const dateChange =
              idx == 0 ||
              (idx > 0 &&
                (prevDate.getFullYear() != thisDate.getFullYear() ||
                  prevDate.getMonth() != thisDate.getMonth() ||
                  prevDate.getDate() != thisDate.getDate()));

            const unread = mess.sender_type == otherUserTypeName && !thisRead;
            const firstUnread =
              !removeUnreadTrigger &&
              firstUnreadId == -1 &&
              mess.sender_type == otherUserTypeName &&
              ((idx == 0 && !thisRead) || (idx > 0 && prevRead && !thisRead));

            if (firstUnread) {
              firstUnreadId = mess.id;
            }
            if (unread) {
              handleUnreadMessages(mess.id);
            }

            if (mess.sender_type == userTypeName) {
              return (
                <>
                  {dateChange && (
                    <DateBox key={"date" + mess.id}>
                      {thisDate.toLocaleString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </DateBox>
                  )}
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
                    {conversationState == "quoted" ||
                    conversationState == "rejected"
                      ? maskSensibleInformation(mess.text)
                      : mess.text}
                    <InnerBox>
                      {new Date(Date.parse(mess.created_at)).toLocaleString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </InnerBox>
                  </MessageBox>
                </>
              );
            } else {
              return (
                <>
                  {dateChange && (
                    <DateBox key={"date" + mess.id}>
                      {thisDate.toLocaleString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </DateBox>
                  )}
                  {firstUnread && (
                    <DateBox
                      ref={unreadBottom}
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      UNREAD MESSAGES
                    </DateBox>
                  )}
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
                    {conversationState == "quoted" ||
                    conversationState == "rejected"
                      ? maskSensibleInformation(mess.text)
                      : mess.text}
                    <InnerBox>
                      {new Date(Date.parse(mess.created_at)).toLocaleString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </InnerBox>
                  </MessageBox>
                </>
              );
            }
          }
        })}
      <div ref={chatBottom}></div>
      {scrolled && <div ref={realBottom}></div>}
    </MessageFrame>
  );
};

export default React.memo(Messages);
