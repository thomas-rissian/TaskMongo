const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks.controller');

// ------------------ CRUD TASKS ------------------
router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

// ------------------ FILTRE + TRI ------------------
router.get('/filter/search', taskController.filtered);

module.exports = router;
