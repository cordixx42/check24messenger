const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");

nextMessageId = 99;

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/check24-2");

const conversationSchema = new mongoose.Schema({
  id: Number,
  customer_name: String,
  service_provider_name: String,
  state: String,
  created_at: Date,
  updated_at: Date,
  accepted_at: Date,
  review: Number,
});

const messageSchema = new mongoose.Schema({
  id: Number,
  conversation_id: Number,
  message_type: String,
  text: String,
  sender_type: String,
  read_at: Date,
  created_at: Date,
  updated_at: Date,
  base64_file: String,
  was_read: Number,
});

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

// key-value pair to save userName-socketId
const activeUsersToSockets = {};

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
    conv = await Conversation.find(
      { service_provider_name: name },
      "id customer_name service_provider_name state"
    );
  } else {
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
  const mess = await Message.find({ conversation_id: convId })
    .sort({
      created_at: -1,
    })
    .limit(100);
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

  socket.on("getOtherUser", async (data) => {
    conv = await Conversation.find(
      { id: data.convId },
      "id customer_name service_provider_name"
    );
    socket.emit("receiveOtherUser", conv[0]);
  });

  socket.on("getConversationData", async (data) => {
    conv = await Conversation.find({ id: data.convId });
    socket.emit("receiveConversationState", {
      convId: data.convId,
      state: conv[0].state,
    });
    socket.emit("receiveConversationAccept", {
      convId: data.convId,
      date: conv[0].accepted_at,
    });
    socket.emit("receiveOtherUser", conv[0]);
    socket.emit("receiveReview", {
      convId: data.convId,
      review: conv[0].review,
    });
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

    var m = new Message({
      id: nextMessageId,
      conversation_id: data.convId,
      message_type: data.message_type,
      text: data.text,
      sender_type: userTypeName,
      read_at: null,
      created_at: data.date,
      updated_at: data.date,
      base64_file: data.withFile ? data.fileBase64 : "",
      was_read: 0,
    });

    m.save()
      .then(function (data) {
        console.log("saving successful");
        console.log(data);
        //send back to sender
        socket.emit("receiveSingleMessage", data);
        // try send to recipient if existing in active sockets
        const recSocket = activeUsersToSockets[recipient];
        console.log("receiving socket is " + recSocket);
        if (recSocket != undefined) {
          io.to(recSocket).emit("receiveSingleMessage", data);
        }
      })
      .catch(function (err) {
        console.log("saving not successful");
        console.log(err);
      });

    //update updated_at
    const filter = { id: data.convId };
    const update = { updated_at: m.created_at };
    await Conversation.findOneAndUpdate(filter, update);

    //update conversation state if neccesary
    var convState = "";
    if (m.message_type == "reject_quote_message") {
      const filter = { id: data.convId };
      const update = { state: "rejected" };
      await Conversation.findOneAndUpdate(filter, update);
      convState = "rejected";
    } else if (m.message_type == "accept_quote_message") {
      const filter = { id: data.convId };
      const update = {
        state: "accepted",
        accepted_at: m.created_at,
      };
      await Conversation.findOneAndUpdate(filter, update);
      convState = "accepted";
    }

    convState != "" &&
      socket.emit("receiveConversationState", {
        convId: data.convId,
        state: convState,
      });
    convState == "accepted" &&
      socket.emit("receiveConversationAccept", {
        convId: data.convId,
        date: m.created_at,
      });
    const recSocket = activeUsersToSockets[recipient];
    if (convState != "" && recSocket != undefined) {
      io.to(recSocket).emit("receiveConversationState", {
        convId: data.convId,
        state: convState,
      });
      convState == "accepted" &&
        io.to(recSocket).emit("receiveConversationAccept", {
          convId: data.convId,
          date: m.created_at,
        });
    }

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

  //TODO
  socket.on("getMessagesForPage", async (data) => {
    console.log("clients loading initial messages");
    const convId = data.convId;
    //TODO currently firstDate is id, assumes that id grow monotonously, but better to do with creation dates
    const firstDate = data.firstDate;
    const mess = await Message.find({
      conversation_id: convId,
      id: { $gte: firstDate },
    })
      .sort({
        created_at: 1,
      })
      .limit(25);
    socket.emit("receiveMessagesForPage", mess);
  });

  socket.on("reviewRequest", async (data) => {
    var m = new Message({
      id: nextMessageId,
      conversation_id: data.convId,
      message_type: "review_request",
      text: "",
      sender_type: data.userTypeName,
      read_at: null,
      created_at: data.date,
      updated_at: data.date,
      base64_file: "",
      was_read: 0,
    });

    const recipient = data.recipient;

    m.save()
      .then(function (data) {
        //send back to sender
        socket.emit("receiveSingleMessage", data);
        // try send to recipient if existing in active sockets
        const recSocket = activeUsersToSockets[recipient];
        if (recSocket != undefined) {
          io.to(recSocket).emit("receiveSingleMessage", data);
        }
      })
      .catch(function (err) {
        console.log("saving not successful");
        console.log(err);
      });

    nextMessageId++;

    //update conversation review to 0
    const filter = { id: data.convId };
    const update = {
      review: 0,
      updated_at: m.created_at,
    };
    await Conversation.findOneAndUpdate(filter, update);
    //send back to sender
    socket.emit("receiveReview", {
      convId: data.convId,
      review: 0,
    });
    // try send to recipient if existing in active sockets
    const recSocket = activeUsersToSockets[recipient];
    if (recSocket != undefined) {
      io.to(recSocket).emit("receiveReview", {
        convId: data.convId,
        review: 0,
      });
    }
  });

  socket.on("reviewAnswer", async (data) => {
    var m = new Message({
      id: nextMessageId,
      conversation_id: data.convId,
      message_type: "review_answer",
      text: "",
      sender_type: data.userTypeName,
      read_at: null,
      created_at: data.date,
      updated_at: data.date,
      base64_file: "",
      was_read: 0,
    });

    const recipient = data.recipient;

    //update conversation review to score
    const filter = { id: data.convId };
    const update = {
      review: data.score,
      updated_at: m.created_at,
    };
    await Conversation.findOneAndUpdate(filter, update);
    //send back to sender
    socket.emit("receiveReview", {
      convId: data.convId,
      review: data.score,
    });
    // try send to recipient if existing in active sockets
    const recSocket = activeUsersToSockets[recipient];
    if (recSocket != undefined) {
      io.to(recSocket).emit("receiveReview", {
        convId: data.convId,
        review: data.score,
      });
    }

    m.save()
      .then(function (data) {
        //send back to sender
        socket.emit("receiveSingleMessage", data);
        // try send to recipient if existing in active sockets
        const recSocket = activeUsersToSockets[recipient];
        if (recSocket != undefined) {
          io.to(recSocket).emit("receiveSingleMessage", data);
        }
      })
      .catch(function (err) {
        console.log("saving not successful");
        console.log(err);
      });

    nextMessageId++;
  });

  socket.on("unreadUpdate", async (data) => {
    console.log("unread update income");
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      const messId = data[i];
      console.log("messId " + messId);
      const filter = { id: messId };
      const update = {
        was_read: 1,
      };
      await Message.findOneAndUpdate(filter, update);
    }
  });

  socket.on("singleUnreadUpdate", async (data) => {
    console.log("single id " + data);
    const filter = { id: data };
    const update = {
      was_read: 1,
    };
    await Message.findOneAndUpdate(filter, update);
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

http.listen(3001, () => {
  console.log("listening on *:3001");
});
