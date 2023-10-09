const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");
// const {
//   conversationSchema,
//   messageSchema,
// } = require("./tests/initialDataLoad");

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/check24");

const conversationSchema = new mongoose.Schema({
  id: Number,
  customer_name: String,
  service_provider_name: String,
  state: String,
  created_at: Date,
  updated_at: Date,
});

// read_at as string because it can also be not read yet === ""
const messageSchema = new mongoose.Schema({
  id: Number,
  conversation_id: Number,
  message_type: String,
  text: String,
  sender_type: String,
  read_at: String,
  created_at: Date,
  updated_at: Date,
});

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// given a username and a type (0,1) gives back a list of conversations for this user
app.get("/conversations", async (req, res) => {
  const name = req.query.name;
  const type = req.query.type;

  var conv;

  //depending on type fetch based on customer / service-provider
  if (type == "1") {
    console.log("service provider");
    conv = await Conversation.find(
      { service_provider_name: name },
      "id customer_name service_provider_name state"
    );
  } else {
    console.log("customer");
    conv = await Conversation.find(
      { customer_name: name },
      "id customer_name service_provider_name state"
    );
  }

  res.send(conv);
});

// given a conversation id gives back all messages in the conversation ordered by creation date
app.get("/messages", async (req, res) => {
  const convId = req.query.convId;
  const mess = await Message.find({ conversation_id: convId }).sort({
    created_at: -1,
  });

  res.send(mess);
});

//create new socket connection to client
io.on("connection", (socket) => {
  console.log("connected to a client");
  console.log(socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(3001, () => {
  console.log("listening on *:3001");
});
