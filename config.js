require("dotenv").config();

module.exports = {
  DB_CONNECT: process.env.DB_CONNECT,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};
