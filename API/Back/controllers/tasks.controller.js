const Task = require('../models/task.schema');
const { logMultipleModifications } = require('../utils/history.utils');

// ------------------ CREATE ------------------
exports.create = async (req, res) => {
  try {
    const payload = req.validatedData;

    const task = new Task(payload);
    const saved = await task.save();

    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ READ ALL ------------------
exports.getAll = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dateCreation: -1 });
    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ READ ONE ------------------
exports.getOne = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ UPDATE ------------------
exports.update = async (req, res) => {
  try {
    const taskId = req.params.id;
    // Les données sont déjà validées par le middleware Zod
    const payload = req.validatedData;

    // Récupérer l'ancienne tâche pour l'historique
    const oldTask = await Task.findById(taskId);
    if (!oldTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      payload,
      { new: true, runValidators: true }
    );

    // Enregistrer les modifications dans l'historique
    await logMultipleModifications(taskId, oldTask.toObject(), payload);

    res.json(updatedTask);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ DELETE ------------------
exports.remove = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée avec succès', deletedTask: deleted });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ FILTER + SORT ------------------
exports.filtered = async (req, res) => {
  try {
    const { statut, priorite, categorie, etiquette, avant, apres, q, tri, ordre } = req.validatedQuery || req.query;

    const filter = {};

    if (statut) filter.statut = statut;
    if (priorite) filter.priorite = priorite;
    if (categorie) filter.categorie = categorie;
    if (etiquette) filter.etiquettes = { $regex: etiquette, $options: 'i' };

    if (avant || apres) {
      filter.echeance = {};
      if (avant) filter.echeance.$lte = new Date(avant);
      if (apres) filter.echeance.$gte = new Date(apres);
    }

    if (q) {
      const regex = { $regex: q, $options: 'i' };
      filter.$or = [
        { titre: regex },
        { description: regex },
        { 'auteur.nom': regex },
        { 'auteur.prenom': regex },
        { categorie: regex },
        { etiquettes: regex }
      ];
    }

    const sort = {};
    const validSortFields = ['dateCreation', 'echeance', 'priorite', 'titre'];
    
    if (tri && validSortFields.includes(tri)) {
      sort[tri] = ordre === 'desc' ? -1 : 1;
    } else {
      sort.dateCreation = -1;
    }

    const tasks = await Task.find(filter).sort(sort).exec();
    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};


// ------------------ GET HISTORY ------------------
exports.getHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({
      taskId: task._id,
      titre: task.titre,
      historique: task.historiqueModifications.sort((a, b) => b.date - a.date)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};
