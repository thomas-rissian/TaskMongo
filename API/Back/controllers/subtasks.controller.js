const Task = require("../models/task.schema");

exports.createSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

    // Les données sont déjà validées par le middleware Zod
    const subtaskData = req.validatedData;
    
    task.sousTaches.push(subtaskData);
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

    const sub = task.sousTaches.id(req.params.sid);
    if (!sub) return res.status(404).json({ error: "Sous-tâche introuvable" });

    // Les données sont déjà validées par le middleware Zod
    const updatedData = req.validatedData;
    
    Object.assign(sub, updatedData);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

    const sub = task.sousTaches.id(req.params.sid);
    if (!sub) return res.status(404).json({ error: "Sous-tâche introuvable" });

    sub.deleteOne();
    await task.save();

    res.json({ message: "Sous-tâche supprimée", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
