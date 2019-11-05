const winston = require("winston");
//require("winston-mongodb");
require("express-async-errors");

module.exports = function(app) {
  process.on("uncaughtException", ex => {
    console.log("WE GOT AN UNCAUGHT EXCEPTION");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", ex => {
    console.log("WE GOT AN UNHANDLED REJECTION");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/vidly",
  //   level: "error"
  // });
};
