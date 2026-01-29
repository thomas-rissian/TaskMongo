const express = require('express');
const router = express.Router();
const { z } = require('zod');
const taskController = require('../controllers/tasks.controller');
const { validateBody, validateQuery, validateParams } = require('../validators/validation.middleware');
const { TaskCreateSchema, TaskUpdateSchema, TaskFilterSchema, MongoIdSchema } = require('../validators/schemas.validator');

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Données invalides
 *   get:
 *     summary: Récupérer toutes les tâches
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */

// --- FILTRES + RECHERCHE (avant les routes paramétrées) ---
/**
 * @swagger
 * /api/tasks/search:
 *   get:
 *     summary: Rechercher et filtrer les tâches
 *     tags: [Tasks]
 *     parameters:
 *       - name: statut
 *         in: query
 *         schema:
 *           type: string
 *           enum: [Backlog, Ready, "In progress", "In review", Done]
 *       - name: priorite
 *         in: query
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - name: categorie
 *         in: query
 *         schema:
 *           type: string
 *       - name: etiquette
 *         in: query
 *         schema:
 *           type: string
 *       - name: avant
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: apres
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: q
 *         in: query
 *         schema:
 *           type: string
 *       - name: tri
 *         in: query
 *         schema:
 *           type: string
 *       - name: ordre
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Tâches filtrées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/search', validateQuery(TaskFilterSchema), taskController.filtered);

// --- HISTORIQUE ---
/**
 * @swagger
 * /api/tasks/{id}/history:
 *   get:
 *     summary: Récupérer l'historique d'une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historique récupéré
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HistoryEntry'
 *       404:
 *         description: Tâche non trouvée
 */
router.get('/:id/history', validateParams(z.object({ id: MongoIdSchema })), taskController.getHistory);

// --- CRUD TASKS ---
router.post('/', validateBody(TaskCreateSchema), taskController.create);
router.get('/', taskController.getAll);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Récupérer une tâche spécifique
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche récupérée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *   put:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
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
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche supprimée
 *       404:
 *         description: Tâche non trouvée
 */
router.get('/:id', validateParams(z.object({ id: MongoIdSchema })), taskController.getOne);
router.put('/:id', validateBody(TaskUpdateSchema), taskController.update);
router.delete('/:id', validateParams(z.object({ id: MongoIdSchema })), taskController.remove);

module.exports = router;
