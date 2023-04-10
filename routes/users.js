const router = require("express").Router();

//ユーザー登録
router.post("/register", (req, res) => {
  try {
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/", (req, res) => {
//   res.send("user router");
// });

module.exports = router;
