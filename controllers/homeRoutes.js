const { Post, User, Comment } = require("../models");

const router = require("express").Router();

//ROUTE THAT GETS ALL POSTS AND RENDERS THE HOME PAGE
router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      attributes: ["id", "title", "postText", "createdAt"],
    });
    const posts = allPosts.map((post) => post.get({ plain: true }));
    res.render("homepage", { posts, loggedIn: req.session.loggedIn });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
// router.get("/", (req, res) => {
//   res.render("homepage");
// });


//ROUTE TO GET SINGLE POST AND RENDERS SINGLE POST PAGE
router.get("/post/:id", async (req, res) => {
  try {
    const singlePost = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "postText", "title", "createdAt"],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text", "postId", "userId", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        // {
        //   model: User,
        //   attributes: ["username"],
        // },
      ],
    });
    if (!singlePost) {
      res.status(404).json({ message: "No post found with that id" });
      return;
    }
    const post = singlePost.get({ plain: true });
    res.render("single-post", { post, loggedIn: req.session.loggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});


//RENDERS LOG IN PAGE AS LONG AS THE USER ISN'T ALREADY LOGGED IN
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

module.exports = router;
