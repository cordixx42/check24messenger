const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//create new socket connection to client
io.on("connection", (socket) => {
  console.log("connected to a client");
  console.log(socket);
});

http.listen(3001, () => {
  console.log("listening on *:3001");
});
