// var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017/test";

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

const { MongoClient } = require("mongodb");

// Create Instance of MongoClient for mongodb
const client = new MongoClient("mongodb://localhost:27017");

async function run() {
  try {
    // Get the database and collection on which to run the operation
    const database = client.db("mydatabase");
    const customers = database.collection("customers");
    // Query for a movie that has the title 'The Room'
    //   const query = { title: "The Room" };
    //   const options = {
    //     // Sort matched documents in descending order by rating
    //     sort: { "imdb.rating": -1 },
    //     // Include only the `title` and `imdb` fields in the returned document
    //     projection: { _id: 0, title: 1, imdb: 1 },
    //   };
    // Execute query
    const customer = await customers.findOne({}, {});
    // Print the document returned by findOne()
    console.log(customer);

    // TEST MODIFICATION OPERATIONS
    const doc = {
      name: "Juni",
      address: "bad homburg",
    };
    const result = await customers.insertOne(doc);
    console.log(result.insertedId);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

// // Connect to database
// client
//   .connect()
//   .then(() => {
//     console.log("Connected Successfully");
//     client
//       .db("mydatabase")
//       .collection("customers")
//       .findOne({}, function (err, result) {
//         if (err) throw err;
//         console.log(result.name);
//       });
//     console.log("trying out operations");
//   })
//   .catch((error) => console.log("Failed to connect", error));
