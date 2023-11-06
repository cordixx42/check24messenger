import styled from "styled-components";

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
`;

export const StyledContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #b4b4b4;
  position: fixed;
  text-align: center;
`;

export const Button = styled.button`
  background: whitesmoke;
  font-size: 20px;
  margin: 1em;
  padding: 0.25em 1em;
  border: 5px solid #005ea8;
  border-radius: 7px;
  cursor: pointer;
`;

export const LoginInputField = styled.input`
  border-radius: 7px;
  border: 3px solid #005ea8;
  padding: 7px 12px;
  outline: none;
  font-size: 16px;
`;

export const MessageInputField = styled.textarea`
  border-radius: 7px;
  border: 1px solid lightblue;
  padding: 7px 12px;
  margin: 15px;
  outline: none;
  font-size: 20px;
  //width: 150%;
  height: 50%;
`;

export const SimpleBox = styled.div`
  background-color: #808fd9;
  font-size: 30px;
  padding: 15px;
  margin: 10px;
  align-items: center;
  border-radius: 7px;
`;
