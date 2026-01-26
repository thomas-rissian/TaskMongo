const express = require('express');
const router = express.Router();
const { z } = require('zod');
const taskController = require('../controllers/tasks.controller');
const { validateBody, validateQuery, validateParams } = require('../validators/validation.middleware');
const { TaskCreateSchema, TaskUpdateSchema, TaskFilterSchema, MongoIdSchema } = require('../validators/schemas.validator');

// --- FILTRES + RECHERCHE (avant les routes paramétrées) ---
router.get('/search', validateQuery(TaskFilterSchema), taskController.filtered);

// --- HISTORIQUE ---
router.get('/:id/history', validateParams(z.object({ id: MongoIdSchema })), taskController.getHistory);

// --- CRUD TASKS ---
router.post('/', validateBody(TaskCreateSchema), taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', validateParams(z.object({ id: MongoIdSchema })), taskController.getOne);
router.put('/:id', validateBody(TaskUpdateSchema), taskController.update);
router.delete('/:id', validateParams(z.object({ id: MongoIdSchema })), taskController.remove);

module.exports = router;
