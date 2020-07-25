const router = require("express").Router();
const { verifyToken } = require("../helpers/jwt-helper");

router.get("/summary", verifyToken, (req, res) => {
  res.json({
    name: "test",
    companyName: "Tata",
  });
});

module.exports = router;
