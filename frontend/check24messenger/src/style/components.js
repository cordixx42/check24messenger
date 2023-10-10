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
  background: papayawhip;
  position: fixed;
  text-align: center;
`;

export const Button = styled.button`
  background: "#BF4F74";
  color: "white";
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #bf4f74;
  border-radius: 7px;
`;

export const InputField = styled.input`
  border-radius: 7px;
  border: 1px solid blue;
  padding: 7px 12px;
  outline: none;
  font-size: 16px;
`;
