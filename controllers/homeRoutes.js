const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    res.render("test-page");
  } catch (error) {}
});

module.exports = router;
