// const base64WithoutPrefix = data.substr(
//     `data:${contentType};base64,`.length
//   );
const text =
  "My email is hannacui4@gmail.com and yours is ui@tum.de. My phone number is +4917646652253 and my website is on http://google.com";

var p1, p2;

let pattern = /[]@/g;

let first = /([\w-\.]+)@/g;

let emailPattern = /([\w-\.]+)@([\w-]+\.)+[\w-]{2,4}/g;

let phonePattern =
  /[\+]?([(]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,10})/g;

let urlPattern = /http\S*/g;

// let result = text.search(first);
// let resultS = text.search(first);
// let result2 = text.match(first);
// let result3 = first.exec(text);
// let result4 = first.exec(text);

// console.log("search " + result);
// console.log("search2 " + resultS);
// console.log("match " + result2);
// console.log("exec " + result3);
// console.log("exec 2 " + result4);

var newstr = text;
// newstr = text.replace(emailPattern, "*");
// console.log(newstr);

const star = "*";

while (null != (z = emailPattern.exec(text))) {
  console.log("exec " + z); // output: object
  const len = z[1].length;
  console.log(len);
  newstr = newstr.replace(z[1], star.repeat(len));
}

console.log(newstr);

while (null != (z = phonePattern.exec(text))) {
  console.log("exec " + z); // output: object
  const len = z[1].length;
  console.log(len);
  newstr = newstr.replace(z[1], star.repeat(len));
}

console.log(newstr);

while (null != (z = urlPattern.exec(text))) {
  console.log("exec " + z); // output: object
  const len = z[0].length;
  console.log(len);
  newstr = newstr.replace(z[0], star.repeat(len));
}

console.log(newstr);
