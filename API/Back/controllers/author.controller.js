const Task = require('../models/task.schema');

exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Task.aggregate([
            { $project: { auteur: 1, _id: 0 } },
            { 
                $group: { 
                    _id: "$auteur.email", 
                    nom: { $first: "$auteur.nom" },
                    prenom: { $first: "$auteur.prenom" },
                    email: { $first: "$auteur.email" }
                }
            },
            { $sort: { nom: 1 } }
        ]);

        res.status(200).json(authors);
    } catch (error) {
        console.error("Erreur lors de la récupération des auteurs:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des auteurs." });
    }
};