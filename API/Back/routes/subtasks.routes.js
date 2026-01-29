const express = require("express");
const router = express.Router();
const { z } = require('zod');
const subTaskController = require("../controllers/subtasks.controller");
const { validateBody, validateParams } = require('../validators/validation.middleware');
const { SubtaskSchema, MongoIdSchema } = require('../validators/schemas.validator');

/**
 * @swagger
 * /api/tasks/{id}/sousTaches:
 *   post:
 *     summary: Ajouter une sous-tâche
 *     tags: [Subtasks]
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
 *             $ref: '#/components/schemas/Subtask'
 *     responses:
 *       201:
 *         description: Sous-tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 */
router.post("/:id/sousTaches", 
  validateParams(z.object({ id: MongoIdSchema })),
  validateBody(SubtaskSchema), 
  subTaskController.createSubtask
);

/**
 * @swagger
 * /api/tasks/{id}/sousTaches/{sid}:
 *   put:
 *     summary: Mettre à jour une sous-tâche
 *     tags: [Subtasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: sid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subtask'
 *     responses:
 *       200:
 *         description: Sous-tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche ou sous-tâche non trouvée
 *   delete:
 *     summary: Supprimer une sous-tâche
 *     tags: [Subtasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: sid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sous-tâche supprimée
 *       404:
 *         description: Tâche ou sous-tâche non trouvée
 */
router.put("/:id/sousTaches/:sid", 
  validateParams(z.object({ id: MongoIdSchema, sid: MongoIdSchema })),
  validateBody(SubtaskSchema), 
  subTaskController.updateSubtask
);

router.delete("/:id/sousTaches/:sid", 
  validateParams(z.object({ id: MongoIdSchema, sid: MongoIdSchema })),
  subTaskController.deleteSubtask
);

module.exports = router;
