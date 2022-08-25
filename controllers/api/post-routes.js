const router = require("express").Router();
const { Post, User, Comment } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      attributes: ["id", "title", "created_at"],
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text", "postId", "userId", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const singleUser = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "created_at"],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text", "userId", "postId", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    if (!singleUser) {
      res.status(404).json({ message: "No post found with this ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      postText: req.body.postText,
      userId: req.session.userId,
    });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        postText: req.body.postText,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!updatedPost) {
      res.status(400).json({ message: "No post found with this id" });
      return;
    }
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedPost) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    res.json(deletedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
module.exports = router;
