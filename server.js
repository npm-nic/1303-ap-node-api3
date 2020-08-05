const express = require("express");
const helmet = require("helmet");

const server = express();

// // GLOBAL MIDDLEWARE // //
server.use(express.json());
server.use(helmet());
server.use(logger); // --> [1a]

// [2]
const userRouter = require("./users/userRouter");
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`hello world`);
});

module.exports = server;

//custom middleware
function logger(req, res, next) {
  // [1]
  let now = new Date().toISOString();
  console.log(`${req.method} to ${req.url} at ${now}`);
  next();
}

// [NOTES]
// [1]
//  --> https://stackoverflow.com/a/30158617/14056123
//  --> https://www.w3schools.com/jsref/jsref_obj_date.asp
//  a. logger --> console {request: METHOD to URL at TIMESTAMP}
//  --> before routes so that EVERY request to server is logged

// [2]
//  setting up users / posts routes
//  --> any request to '/api/users' will be handled in './users/userRouter'
