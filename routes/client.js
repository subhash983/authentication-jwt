const router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const { response } = require("express");
const verify = require("./verifyToken");

router.get("/summary", verify, (req, res) => {
  res.json({
    name: "test",
    companyName: "Tata",
  });
});

module.exports = router;
