const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  const authToken = req.header("auth-token");
  if (!authToken) {
    return res.status(401).send("Authentication Failed");
  }
  try {
    const verified = jwt.verify(authToken, config.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};
