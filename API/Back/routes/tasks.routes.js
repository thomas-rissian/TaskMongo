const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks.controller');

// --- FILTRES + RECHERCHE (avant les routes paramétrées) ---
router.get('/search', taskController.filtered);

// --- HISTORIQUE ---
router.get('/:id/history', taskController.getHistory);

// --- CRUD TASKS ---
router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;
