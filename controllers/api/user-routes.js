const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

//ROUTE TO GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//ROUTE TO GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const singleUser = await User.findOne({
      attributes: {
        exclude: ["password"],
      },
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Post,
          attributes: ["id", "title", "created_at"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_text", "created_at"],
        },
      ],
    });
    if (!singleUser) {
      res.status(404).json({
        message: "No user found with that id.",
      });
      return;
    }
    res.json(singleUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//ROUTE TO CREATE A NEW USER
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    req.session.username = newUser.username;
    req.session.userId = newUser.id;
    req.session.loggedIn = true;
    req.session.save(() => {
      res.json(newUser);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//ROUTE FOR USER TO LOGIN
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "Mo user with that email address!" });
      return;
    }
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect Password!" });
      return;
    }
    req.session.userId = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;
    req.session.save(() => {
      res.json({ user: dbUserData, message: "You are now logged in!" });
      // res.json({ user: dbUserData });
    });
  });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
module.exports = router;
