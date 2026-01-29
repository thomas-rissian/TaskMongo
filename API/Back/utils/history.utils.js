/**
 * Utility pour gérer l'historique des modifications
 */

const Task = require('../models/task.schema');

/**
 * Enregistre la modification d'un champ
 * @param {string} taskId - ID de la tâche
 * @param {string} champModifie - Nom du champ modifié
 * @param {any} ancienneValeur - Ancienne valeur
 * @param {any} nouvelleValeur - Nouvelle valeur
 */
async function logModification(taskId, champModifie, ancienneValeur, nouvelleValeur) {
  try {
    const task = await Task.findById(taskId);
    if (!task) return;

    task.historiqueModifications.push({
      champModifie,
      ancienneValeur,
      nouvelleValeur,
      date: new Date()
    });

    await task.save();
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'historique:', err);
  }
}

/**
 * Compare deux objets et enregistre les modifications
 * @param {string} taskId - ID de la tâche
 * @param {object} ancienObjet - Ancien objet
 * @param {object} nouvelObjet - Nouvel objet
 */
async function logMultipleModifications(taskId, ancienObjet, nouvelObjet) {
  const modifications = [];

  Object.keys(nouvelObjet).forEach(key => {
    if (JSON.stringify(ancienObjet[key]) !== JSON.stringify(nouvelObjet[key])) {
      modifications.push({
        champModifie: key,
        ancienneValeur: ancienObjet[key],
        nouvelleValeur: nouvelObjet[key]
      });
    }
  });

  if (modifications.length > 0) {
    const task = await Task.findById(taskId);
    if (task) {
      modifications.forEach(mod => {
        task.historiqueModifications.push({
          ...mod,
          date: new Date()
        });
      });
      await task.save();
    }
  }
}

module.exports = {
  logModification,
  logMultipleModifications
};
