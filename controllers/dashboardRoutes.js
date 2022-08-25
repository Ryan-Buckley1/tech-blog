const router = require("express").Router();
const { Post, User, Comment } = require("../models");

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      where: {
        userId: req.session.userId,
      },
      attributes: ["id", "title", "postText", "createdAt"],
      include: {
        model: Comment,
        attributes: ["id", "comment_text", "postId", "userId", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    });
    console.log(allPosts);
    const posts = allPosts.map((post) => post.get({ plain: true }));
    res.render("dashboard", { posts, loggedIn: true });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const editedPost = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "postText", "createdAt"],
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
        //   include: ["username"],
        // },
      ],
    });
    if (!editedPost) {
      res.status(404).json({ message: "No post found with that id" });
      return;
    }
    const post = editedPost.get({ plain: true });
    res.render("edit-post", { post, loggedIn: req.session.loggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
