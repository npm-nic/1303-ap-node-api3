const express = require("express");
const helmet = require("helmet");

const server = express();
server.use(express.json());
server.use(helmet());
// logger --> console {request: METHOD to URL at TIMESTAMP}
server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  // [1]
  let now = new Date().toISOString();
  console.log(`${req.method} to ${req.url} at ${now}`);
  next();
}

module.exports = server;

// [1]
//  --> https://stackoverflow.com/a/30158617/14056123
//  --> https://www.w3schools.com/jsref/jsref_obj_date.asp
