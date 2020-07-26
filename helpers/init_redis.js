const redis = require("redis");
const logger = require("./logger");

const client = redis.createClient({
  port: 32768,
  host: "0.0.0.0",
});

client.on("connect", () => {
  logger.info("Client Connected");
});

client.on("ready", (err) => {
  logger.info("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
  logger.error(err.message);
  client.quit();
});

client.on("end", (err) => {
  logger.info("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
