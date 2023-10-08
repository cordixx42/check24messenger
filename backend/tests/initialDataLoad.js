const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");

const { MongoClient, Timestamp, ObjectId } = require("mongodb");

// const convState = {
//   quoted: "0",
//   rejected: "1",
//   accepted: "2",
// };

mongoose.connect("mongodb://127.0.0.1:27017/check24");

console.log("connected");

//create empty schema for existing ones
//const customerSchema = new mongoose.Schema({});

const conversationSchema = new mongoose.Schema({
  id: Number,
  customer_name: String,
  service_provider_name: String,
  state: String,
  created_at: Date,
  updated_at: Date,
});

// read_at as string because it can also be not read yet === ""
const messageScheme = new mongoose.Schema({
  id: Number,
  conversation_id: Number,
  message_type: String,
  text: String,
  sender_type: String,
  read_at: String,
  created_at: Date,
  updated_at: Date,
});

console.log("done");

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageScheme);

console.log("done2");

//create empty collections
Conversation.createCollection();
Message.createCollection();

//read csv data into them

const convList = [];
const messList = [];

fs.createReadStream("../seedData/conversations.csv")
  .pipe(parse({ delimiter: ";", from_line: 2 }))
  .on("data", function (row) {
    convList.push(row);
  })
  .on("end", () => {
    console.log(convList);
    convList.forEach((elem) => {
      var c = new Conversation({
        id: parseInt(elem[0]),
        customer_name: elem[1],
        service_provider_name: elem[2],
        state: elem[3],
        created_at: Date.parse(elem[4]),
        updated_at: Date.parse(elem[4]),
      });
      c.save();
    });
  });

fs.createReadStream("../seedData/messages.csv")
  .pipe(parse({ delimiter: ";", from_line: 2 }))
  .on("data", function (row) {
    messList.push(row);
  })
  .on("end", () => {
    console.log(messList);
    messList.forEach((elem) => {
      console.log("at element with id" + elem[0]);
      var m = new Message({
        id: parseInt(elem[0]),
        conversation_id: parseInt(elem[1]),
        message_type: elem[2],
        text: elem[3],
        sender_type: elem[4],
        read_at: elem[5],
        created_at: Date.parse(elem[6]),
        updated_at: Date.parse(elem[7]),
      });
      console.log("after element with id" + elem[0]);
      m.save();
      console.log("after saving element with id" + elem[0]);
    });
  });

// async function run() {
//   try {
//     const x = await Customer.find({});
//     console.log(x);
//   } catch (err) {
//     console.log(err);
//   }
// }

// run();
