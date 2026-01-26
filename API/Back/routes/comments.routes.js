const express = require("express");
const router = express.Router();
const { z } = require('zod');
const commentController = require("../controllers/comments.controller");
const { validateBody, validateParams } = require('../validators/validation.middleware');
const { CommentSchema, MongoIdSchema } = require('../validators/schemas.validator');

router.post("/:id/commentaires", 
  validateParams(z.object({ id: MongoIdSchema })),
  validateBody(CommentSchema), 
  commentController.createComment
);

router.delete("/:id/commentaires/:cid", 
  validateParams(z.object({ id: MongoIdSchema, cid: MongoIdSchema })),
  commentController.deleteComment
);

module.exports = router;
