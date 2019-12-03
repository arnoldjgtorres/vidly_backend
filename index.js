const winston = require("winston");
const express = require("express");
const cors = require("cors");
const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Origin", "GET, PUT, POST, DELETE");
//   next();
// });

app.use(cors({ credentials: true, origin: true }));

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3001;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
