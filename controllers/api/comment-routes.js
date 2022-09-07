const router = require("express").Router();
const { Comment } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const allComments = await Comment.findAll({
      attributes: ["id", "comment_text", "userId", "postId"],
    });
    res.json(allComments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.session) {
      const newComment = await Comment.create({
        comment_text: req.body.comment_text,
        userId: req.session.userId,
        postId: req.body.postId,
      });
      res.json(newComment);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedComment = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedComment) {
      res.status(404).json({ message: "No comment found with that id" });
      return;
    }
    res.json(deletedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
