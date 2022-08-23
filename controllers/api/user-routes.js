const router = require("express").Router();
const { User } = require("../../models");

//get all users
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

//Get user by id
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

//Post new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;
    });
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    let singleUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!singleUser) {
      res.status(400).json({ message: "No user found with that email!" });
      return;
    }
    let validPassword = (singleUser = singleUser.checkPassword(
      req.body.password
    ));
    if (!validPassword) {
      res.status(401).json({ message: "Incorrect Password" });
      return;
    }
    req.session.save(() => {
      req.session.userId = singleUser.id;
      req.session.username = singleUser.username;
      req.session.loggedIn = true;

      res.json({ user: singleUser, message: "You are logged in!" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
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
