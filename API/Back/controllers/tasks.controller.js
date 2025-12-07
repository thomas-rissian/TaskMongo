const Task = require('../models/task.schema');

// ------------------ CREATE ------------------
exports.create = async (req, res) => {
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
};


// ------------------ READ ALL ------------------
exports.getAll = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ READ ONE ------------------
exports.getOne = async (req, res) => {
  try {
    console.log(req.params.id);
    const task = await Task.findById(req.params.id);
    console.log(task);
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
    const payload = req.body;
  console.log("Update payload:", req.body);
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

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

    res.json({ message: 'Tâche supprimée avec succès' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};


// ------------------ FILTER + SORT ------------------
exports.filtered = async (req, res) => {
  try {
    const { statut, priorite, categorie, etiquette, echeanceAvant, sort } = req.query;

    const filter = {};

    if (statut) filter.statut = statut;
    if (priorite) filter.priorite = priorite;
    if (categorie) filter.categorie = categorie;
    if (etiquette) filter.etiquettes = { $in: [etiquette] };
    if (echeanceAvant) filter.echeance = { $lte: new Date(echeanceAvant) };

    const tasks = await Task.find(filter).sort(sort || "");

    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};
