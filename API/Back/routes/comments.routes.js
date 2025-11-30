const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments.controller");

router.post("/:id/commentaires", commentController.createComment);
router.delete("/:id/commentaires/:cid", commentController.deleteComment);

module.exports = router;
