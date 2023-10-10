import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Column, Row } from "../style/components";
import { styled } from "styled-components";
import { SingleChat } from "./SingleChat";
import { Outlet } from "react-router-dom";

const ConversationBar = styled(Column)`
  height: 100vh;
  width: 25%;
  background-color: beige;
  justify-content: space-around;
`;

const ConversationBox = styled.div`
  background-color: orange;
  font-size: 30px;
  padding: 15px;
  margin: 10px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: lightblue;
  }
`;

const DetailedChatArea = styled.div`
  height: 100vh;
  width: 75%;
  background-color: gray;
`;

const NotFound = () => <div>Not found</div>;

export const ChatOverview = () => {
  const navigate = useNavigate();

  const { user } = useParams();
  const userName = user.slice(0, user.length - 1);
  // 0 -> customer, 1 -> service-provider
  const userType = parseInt(user.at(user.length - 1));

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:3001/conversations/?name=" +
        userName +
        "&type=" +
        userType
    )
      .then((res) => res.json())
      .then((data) => setConversations(data));
  }, []);

  //this function called too much, even before a click on conversation box occurs
  const handleConversation = (providerName) => {
    console.log(providerName);
    navigate("/user/" + user + "/la");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/chat");
  };

  return (
    <>
      <h1>
        This should be overview page of all chats of user "{user}" with name "
        {userName}" and type "{userType}"
      </h1>

      <Row>
        <ConversationBar>
          <h1>Conversations go here</h1>
          {conversations &&
            conversations.map((conv) => (
              <ConversationBox
                onClick={handleConversation(conv.service_provider_name)}
              >
                {conv.service_provider_name}
              </ConversationBox>
            ))}
        </ConversationBar>
        <DetailedChatArea>
          <Outlet />
        </DetailedChatArea>
      </Row>
    </>
  );
};
