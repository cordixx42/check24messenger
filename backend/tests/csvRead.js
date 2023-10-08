const fs = require("fs");
const { parse } = require("csv-parse");

const convList = [];

fs.createReadStream("../seedData/conversations.csv")
  .pipe(parse({ delimiter: ";", from_line: 2 }))
  .on("data", function (row) {
    convList.push(row);
  })
  .on("end", () => {
    console.log(convList);
    convList.forEach((elem) => console.log(parseInt(elem[0])));
  });
