const redis = require("redis");

const client = redis.createClient({
  port: 32768,
  host: "0.0.0.0",
});

client.on("connect", () => {
  console.log("Client Connected");
});

client.on("ready", (err) => {
  console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", (err) => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
