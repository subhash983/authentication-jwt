const jwt = require("jsonwebtoken");
const config = require("../config");
const createError = require("http-errors");
const redisClient = require("./init_redis");

const verifyToken = (req, res, next) => {
  const authToken = req.header("auth-token");
  if (!authToken) {
    return res.status(401).send("Authentication Failed");
  }
  try {
    const verified = jwt.verify(authToken, config.ACCESS_TOKEN_SECRET);
    if (verified) {
      redisClient.GET(verified._id, (err, value) => {
        if (err) {
          console.log(err.message);
          const error = createError.InternalServerError();
          return res.status(error.status).send(error);
        }
        if (authToken !== value) {
          console.log("Token Not found in redis");
          const error = createError.Unauthorized("Unauthorized");
          return res.status(error.status).send(error);
        }
        req.user = verified;
        next();
      });
    }
  } catch (error) {
    const message =
      error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
    const httpError = createError.Unauthorized(message);
    res.status(httpError.status).send(httpError);
  }
};

const removeToken = (authToken) => {
  return new Promise((resolve, reject) => {
    try {
      const verified = jwt.verify(authToken, config.ACCESS_TOKEN_SECRET);
      if (verified) {
        redisClient.DEL(verified._id);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      resolve();
    }
  });
};

const signToken = (userId) => {
  return new Promise((resolve, reject) => {
    const jwtOptions = {
      expiresIn: 30,
    };

    jwt.sign(
      { _id: userId },
      config.ACCESS_TOKEN_SECRET,
      jwtOptions,
      (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        redisClient.SET(userId, token, "ex", 30, (err, reply) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError());
          }
          resolve(token);
        });
      }
    );
  });
};

// const signRefreshToken = (userId) => {
//   const jwtOptions = {
//     expiresIn: "1y",
//   };
//   const token = jwt.sign(
//     { _id: userId },
//     config.REFRESH_TOKEN_SECRET,
//     jwtOptions
//   );
//   res.header("auth-token", token).send(token);
// };

module.exports = {
  verifyToken,
  signToken,
  removeToken,
  // signRefreshToken,
};
