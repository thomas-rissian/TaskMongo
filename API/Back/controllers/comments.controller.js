const Task = require("../models/task.schema");

exports.createComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

    task.commentaires.push(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

    const commentaire = task.commentaires.id(req.params.cid);
    if (!commentaire) return res.status(404).json({ error: "Commentaire introuvable" });

    commentaire.deleteOne();
    await task.save();

    res.json({ message: "Commentaire supprimé", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
