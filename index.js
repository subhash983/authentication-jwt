const express = require("express");
const authRoute = require("./routes/auth");
const clientRoute = require("./routes/client");
const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./helpers/logger");

const app = express();

//Connect to db
mongoose.connect(
  config.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, msg) => {
    if (err) {
      logger.info(err.message);
    } else {
      logger.info("connected to Mongo DB");
    }
  }
);

//Middleware
app.use(express.json());

//Routes Middleware
app.use("/api/user", authRoute);
app.use("/api/client", clientRoute);

app.listen(config.PORT, () =>
  logger.info(`Server running on port ${config.PORT}`)
);
