const express = require("express");
const router = express.Router();
const { z } = require('zod');
const commentController = require("../controllers/comments.controller");
const { validateBody, validateParams } = require('../validators/validation.middleware');
const { CommentSchema, MongoIdSchema } = require('../validators/schemas.validator');

/**
 * @swagger
 * /api/tasks/{id}/commentaires:
 *   post:
 *     summary: Ajouter un commentaire
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Commentaire créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 */
router.post("/:id/commentaires", 
  validateParams(z.object({ id: MongoIdSchema })),
  validateBody(CommentSchema), 
  commentController.createComment
);

/**
 * @swagger
 * /api/tasks/{id}/commentaires/{cid}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: cid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commentaire supprimé
 *       404:
 *         description: Tâche ou commentaire non trouvé
 */
router.delete("/:id/commentaires/:cid", 
  validateParams(z.object({ id: MongoIdSchema, cid: MongoIdSchema })),
  commentController.deleteComment
);

module.exports = router;
