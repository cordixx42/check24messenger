const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");
// const {
//   conversationSchema,
//   messageSchema,
// } = require("./tests/initialDataLoad");

//TOOD change this
nextMessageId = 8;

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

// key-value pair to save userName-socketId
const activeUsersToSockets = {};
// TODO idea for taking into account that a person can be both customer and client
const activeCustomersToSockets = {};
const activeProvidersToSockets = {};

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//given a username returns true if user exists, false if not
app.get("/identification", async (req, res) => {
  const name = req.query.name;
  const type = req.query.type;
  var count = 0;
  if (type == "1") {
    count = await Conversation.find(
      { service_provider_name: name },
      "service_provider_name"
    ).count();
  } else {
    count = await Conversation.find(
      { customer_name: name },
      "customer_name"
    ).count();
  }

  res.send(count > 0);
});

// given a username and a type (0,1) gives back a list of conversations for this user
app.get("/conversations", async (req, res) => {
  console.log("rest conversation request");
  const name = req.query.name;
  const type = req.query.type;

  var conv;

  //depending on type fetch based on customer / service-provider
  if (type == "1") {
    //console.log("service provider");
    conv = await Conversation.find(
      { service_provider_name: name },
      "id customer_name service_provider_name state"
    );
  } else {
    //console.log("customer");
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

  // console.log(mess[0]);

  res.send(mess);
});

//create new socket connection to client
io.on("connection", (socket) => {
  console.log("connected to a client");
  console.log(socket.id);

  //for username to socket mapping
  socket.on("initialIdentfication", (data) => {
    console.log("oh something came");
    console.log(data);
    activeUsersToSockets[data.userName] = data.socketId;
    console.log(activeUsersToSockets);
  });

  socket.on("getConversationState", async (data) => {
    console.log("conv state inquiry");
    conv = await Conversation.find({ id: data.convId }, "state");
    socket.emit("receiveConversationState", conv[0].state);
  });

  socket.on("sendSingleMessage", async (data) => {
    console.log("message came");
    console.log(data);
    var conv;
    var recipient;
    var userTypeName;
    if (data.userType) {
      userTypeName = "service_provider";
      conv = await Conversation.find({ id: data.convId }, "customer_name");
      conv != [] && (recipient = conv[0].customer_name);
    } else {
      userTypeName = "customer";
      conv = await Conversation.find(
        { id: data.convId },
        "service_provider_name"
      );
      conv != [] && (recipient = conv[0].service_provider_name);
    }

    console.log(conv);
    console.log(recipient);

    // TODO check if message will change conversation status !!!

    // TODO save message into database message doc

    var m = new Message({
      id: nextMessageId,
      conversation_id: data.convId,
      message_type: data.message_type,
      text: data.text,
      sender_type: userTypeName,
      read_at: null,
      created_at: data.date,
      updated_at: data.date,
    });
    m.save()
      .then(function (data) {
        console.log("saving successful");
        console.log(data);
        //update conversation if neccesary
        var convState = "";
        if (m.message_type == "reject_quote_message") {
          const filter = { id: data.convId };
          const update = { state: "rejected", updated_at: m.created_at };
          Conversation.findOneAndUpdate(filter, update);
          convState = "rejected";
        } else if (m.message_type == "accept_quote_message") {
          const filter = { id: data.convId };
          const update = { state: "accepted", updated_at: m.created_at };
          Conversation.findOneAndUpdate(filter, update);
          convState = "accepted";
        }
        //send back to sender
        socket.emit("receiveSingleMessage", data);
        convState != "" && socket.emit("receiveConversationState", convState);
        // try send to recipient
        const recSocket = activeUsersToSockets[recipient];
        console.log(recSocket);
        if (recSocket != undefined) {
          // TODO send message in the correct format resulting after insertion into MongoDB
          io.to(recSocket).emit("receiveSingleMessage", data);
          convState != "" &&
            io.to(recSocket).emit("receiveConversationState", convState);
        }
      })
      .catch(function (err) {
        console.log("saving not successful");
        console.log(err);
      });

    console.log("beforeIncrement");

    nextMessageId++;
  });

  socket.on("getAllMessages", async (data) => {
    console.log("clients loading initial messages");
    const convId = data.convId;
    const mess = await Message.find({ conversation_id: convId }).sort({
      created_at: 1,
    });
    socket.emit("receiveAllMessages", mess);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const key = Object.keys(activeUsersToSockets).find(
      (key) => activeUsersToSockets[key] === socket.id
    );
    if (key != undefined) {
      console.log("user socket in dict");
      delete activeUsersToSockets[key];
      console.log(activeUsersToSockets);
    }
  });
});

// io.on("firstIdentification", (data) => {
//   io.emit("responxwxse", data);
// });

http.listen(3001, () => {
  console.log("listening on *:3001");
});
