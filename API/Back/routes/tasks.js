const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// ------------------ CREATE ------------------
// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.titre || !payload.auteur || !payload.auteur.nom || !payload.auteur.email) {
      return res.status(400).json({ error: 'titre et auteur{nom,email} requis' });
    }
    const task = new Task(payload);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// ------------------ READ ALL ------------------
// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// ------------------ READ ONE ------------------
// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// ------------------ UPDATE ------------------
// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const payload = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true } // return the updated document + validation
    );
    if (!updatedTask) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// ------------------ DELETE ------------------
// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
