const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/check24-2");

console.log("connected");

const conversationSchema = new mongoose.Schema({
  id: Number,
  customer_name: String,
  service_provider_name: String,
  state: String,
  created_at: Date,
  updated_at: Date,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

var c = new Conversation({
  id: 3,
  customer_name: "Reyes Herzog",
  service_provider_name: "Hanna Cui",
  state: "quoted",
  created_at: Date.parse("2023-10-06 20:03:32"),
  updated_at: Date.parse("2023-10-13 19:06:49"),
});
c.save();
