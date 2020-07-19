const express = require("express");
const authRoute = require("./routes/auth");
const clientRoute = require("./routes/client");
const mongoose = require("mongoose");
const config = require("./config");

const app = express();

//Connect to db
mongoose.connect(
  config.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, msg) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("connected to db");
    }
  }
);

//Middleware
app.use(express.json());

//Routes Middleware
app.use("/api/user", authRoute);
app.use("/api/client", clientRoute);

app.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT}`)
);
