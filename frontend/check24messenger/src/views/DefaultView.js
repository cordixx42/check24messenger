import logo from "../imgs/check24-logo.jpeg";
import { Column } from "../style/components";
import styled from "styled-components";

const Li = styled.div`
  font-size: 20px;
  font-family: courier;
  text-align: center;
  padding: 30px;
`;

export const Default = () => {
  const colorList = ["#ff6666", "#ffbd55", "#ffff66", "#9de24f", "#87cefa"];

  return (
    <>
      <Column>
        <img src={logo} height="100" style={{ paddingTop: "40px" }} />
        <h1 style={{ fontFamily: "courier" }}> Chat Messenger </h1>
        <Li style={{ color: colorList[0] }}>
          acts as a commmunication platform between service providers and
          customers
        </Li>
        <Li style={{ color: colorList[1] }}>
          enables service providers to send quotes to prospective customers
        </Li>
        <Li style={{ color: colorList[2] }}>
          allows customers to inquire further information before accepting or
          rejecting a quote
        </Li>
        <Li style={{ color: colorList[3] }}>
          includes nice features, like adding attachments to messages or giving
          service reviews
        </Li>
        <Li style={{ color: colorList[4] }}>have fun using it ;)</Li>
      </Column>
    </>
  );
};
