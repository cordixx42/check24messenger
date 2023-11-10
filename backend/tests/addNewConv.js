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
  accepted_at: Date,
  review: Number,
});

const messageSchema = new mongoose.Schema({
  id: Number,
  conversation_id: Number,
  message_type: String,
  text: String,
  sender_type: String,
  read_at: String,
  created_at: Date,
  updated_at: Date,
  base64_file: String,
});

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

const text =
  "It's not simple to say.\
Most days I don't recognize me.\
These shoes and this apron.\
That place and its patrons.\
Have taken more than I gave 'em.\
It's not easy to know.\
I'm not anything like I used to be.\
Although it's true.\
I was never attention sweet center.\
I still remember that girl.\
She's imperfect but she tries.\
She is good but she lies.\
She is hard on herself.\
She is broken and won't ask for help.\
She is messy but she's kind.\
She is lonely most of the time.\
She is all of this mixed up.\
And baked in a beautiful pie.\
She is gone but she used to be mine.\
It's not what I asked for.\
Sometimes life just slips in through a back door.\
And carves out a person.\
And makes you believe it's all true.\
And now I've got you.\
And you're not what I asked for.\
If I'm honest I know I would give it all back.\
For a chance to start over.\
And rewrite an ending or two.\
For the girl that I knew.\
Who be reckless just enough.\
Who can hurt but.\
Who learns how to toughen up when she's bruised.\
And gets used by a man who can't love.\
And then she'll get stuck and be scared.\
Of the life that's inside her.\
Growing stronger each day.\
'Til it finally reminds her.\
To fight just a little.\
To bring back the fire in her eyes.\
That's been gone but it used to be mine.\
Used to be mine.\
She is messy but she's kind.\
She is lonely most of the time.\
She is all of this mixed up and baked in a beautiful pie.\
She is gone but she used to be mine.\
Boys, workin' on empty.\
Is that the kinda way to face the burning heat?.\
I just think about my baby.\
I'm so full of love I could barely eat.\
There's nothing sweeter than my baby.\
I'd never want once from the cherry tree.\
'Cause my baby's sweet as can be.\
She give me toothaches just from kissin' me.\
When my time comes around.\
Lay me gently in the cold, dark earth.\
No grave can hold my body down.\
I'll crawl home to her.\
Boys, when my baby found me.\
I was three days on a drunken sin.\
I woke with her walls around me.\
Nothin' in her room but an empty crib.\
And I was burnin' up a fever.\
I didn't care much how long I lived.\
But I swear I thought I dreamed her.\
She never asked me once about the wrong I did.\
When my time comes around.\
Lay me gently in the cold, dark earth.\
No grave can hold my body down.\
I'll crawl home to her.\
When my time comes around.\
Lay me gently in the cold, dark earth.\
No grave can hold my body down.\
I'll crawl home to her.\
My babe would never fret none.\
About what my hands and my body done.\
If the Lord don't forgive me.\
I'd still have my baby and my babe would have me.\
When I was kissing on my baby.\
And she put her love down soft and sweet.\
In the low lamplight I was free.\
Heaven and hell were words to me.\
When my time comes around.\
Lay me gently in the cold, dark earth.\
No grave can hold my body down.\
I'll crawl home to her.\
When my time comes around.\
Lay me gently in the cold, dark earth.\
No grave can hold my body down.\
I'll crawl home to her";

const sentenceArray = text.split(".");

console.log(sentenceArray.length);

// var c = new Conversation({
//   id: 3,
//   customer_name: "Reyes Herzog",
//   service_provider_name: "Hanna Cui",
//   state: "quoted",
//   created_at: Date.parse("2023-10-06 20:03:32"),
//   updated_at: Date.parse("2023-10-13 19:06:49"),
// });
// c.save();

// var c = new Conversation({
//   id: 4,
//   customer_name: "Reyes Herzog",
//   service_provider_name: "Jake Shimabukuro",
//   state: "quoted",
//   created_at: Date.now(),
//   updated_at: Date.now(),
// });
// c.save();

var c = new Conversation({
  id: 6,
  customer_name: "Jyn Erso",
  service_provider_name: "Paula Becker",
  state: "quoted",
  created_at: Date.now(),
  updated_at: Date.now(),
  accepted_at: null,
  review: -1,
});
c.save();

// var currentId = 10;

// var i = 0;
// for (i; i < 89; i++) {
//   var m = new Message({
//     id: currentId,
//     conversation_id: 4,
//     message_type: "standard_message",
//     text: sentenceArray[i],
//     sender_type: i % 2 == 0 ? "customer" : "service_provider",
//     read_at: null,
//     created_at: Date.now(),
//     updated_at: Date.now(),
//     base64_file: "",
//   });
//   m.save();
//   currentId++;
// }
