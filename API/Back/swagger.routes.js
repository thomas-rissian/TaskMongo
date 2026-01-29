/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     description: Crée une nouvelle tâche avec tous les détails fournis
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *           examples:
 *             simple:
 *               summary: Exemple simple
 *               value:
 *                 titre: "Développer la nouvelle fonctionnalité"
 *                 priorite: "High"
 *                 auteur:
 *                   nom: "Dupont"
 *                   prenom: "Jean"
 *                   email: "jean.dupont@example.com"
 *             complex:
 *               summary: Exemple avec sous-tâches
 *               value:
 *                 titre: "Implémenter l'authentification"
 *                 description: "Ajouter un système d'authentification sécurisé"
 *                 priorite: "Critical"
 *                 statut: "In progress"
 *                 auteur:
 *                   nom: "Martin"
 *                   prenom: "Pierre"
 *                   email: "pierre.martin@example.com"
 *                 categorie: "Sécurité"
 *                 etiquettes: ["auth", "backend", "urgent"]
 *                 echeance: "2026-02-28T23:59:59Z"
 *                 sousTaches:
 *                   - titre: "Implémenter JWT"
 *                     statut: "In progress"
 *                   - titre: "Tests unitaires"
 *                     statut: "Backlog"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Récupérer toutes les tâches
 *     description: Retourne la liste complète de toutes les tâches
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Liste des tâches récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/tasks/search:
 *   get:
 *     summary: Rechercher et filtrer les tâches
 *     description: Permet de filtrer les tâches selon plusieurs critères
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: statut
 *         in: query
 *         description: Filtrer par statut
 *         schema:
 *           type: string
 *           enum: [Backlog, Ready, "In progress", "In review", Done]
 *       - name: priorite
 *         in: query
 *         description: Filtrer par priorité
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - name: categorie
 *         in: query
 *         description: Filtrer par catégorie
 *         schema:
 *           type: string
 *       - name: etiquette
 *         in: query
 *         description: Filtrer par étiquette
 *         schema:
 *           type: string
 *       - name: avant
 *         in: query
 *         description: Filtrer avant une date (format YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: apres
 *         in: query
 *         description: Filtrer après une date (format YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: q
 *         in: query
 *         description: Recherche textuelle dans le titre ou la description
 *         schema:
 *           type: string
 *       - name: tri
 *         in: query
 *         description: Champ sur lequel trier
 *         schema:
 *           type: string
 *       - name: ordre
 *         in: query
 *         description: Ordre de tri
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Tâches filtrées récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Paramètres invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/tasks/{id}:
 *   get:
 *     summary: Récupérer une tâche spécifique
 *     description: Retourne les détails d'une tâche spécifique par son ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *     responses:
 *       200:
 *         description: Tâche récupérée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour une tâche
 *     description: Modifie une ou plusieurs propriétés d'une tâche existante
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *           examples:
 *             updateStatus:
 *               summary: Mettre à jour le statut
 *               value:
 *                 statut: "Done"
 *             updateMultiple:
 *               summary: Mettre à jour plusieurs champs
 *               value:
 *                 statut: "In review"
 *                 priorite: "Medium"
 *                 etiquettes: ["review", "backend"]
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Données ou ID invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer une tâche
 *     description: Supprime une tâche et toutes les données associées
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tâche supprimée"
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/tasks/{id}/history:
 *   get:
 *     summary: Récupérer l'historique d'une tâche
 *     description: Retourne l'historique des modifications d'une tâche
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *     responses:
 *       200:
 *         description: Historique récupéré
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HistoryEntry'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/tasks/{id}/sousTaches:
 *   post:
 *     summary: Ajouter une sous-tâche
 *     description: Crée une nouvelle sous-tâche pour une tâche existante
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche parente
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subtask'
 *           examples:
 *             example1:
 *               value:
 *                 titre: "Implémenter la validation"
 *                 statut: "Backlog"
 *     responses:
 *       201:
 *         description: Sous-tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *       400:
 *         description: Données invalides
 *
 * /api/tasks/{id}/sousTaches/{sid}:
 *   put:
 *     summary: Mettre à jour une sous-tâche
 *     description: Modifie une sous-tâche existante
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche parente
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *       - name: sid
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la sous-tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subtask'
 *     responses:
 *       200:
 *         description: Sous-tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche ou sous-tâche non trouvée
 *       400:
 *         description: Données ou ID invalides
 *   delete:
 *     summary: Supprimer une sous-tâche
 *     description: Supprime une sous-tâche existante
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche parente
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *       - name: sid
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la sous-tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Sous-tâche supprimée
 *       404:
 *         description: Tâche ou sous-tâche non trouvée
 *       400:
 *         description: ID invalide
 *
 * /api/tasks/{id}/commentaires:
 *   post:
 *     summary: Ajouter un commentaire
 *     description: Crée un nouveau commentaire pour une tâche
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *           examples:
 *             example1:
 *               value:
 *                 auteur:
 *                   nom: "Martin"
 *                   prenom: "Pierre"
 *                   email: "pierre.martin@example.com"
 *                 contenu: "Cela doit être fait rapidement"
 *     responses:
 *       201:
 *         description: Commentaire créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *       400:
 *         description: Données invalides
 *
 * /api/tasks/{id}/commentaires/{cid}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     description: Supprime un commentaire existant
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB de la tâche
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439010
 *       - name: cid
 *         in: path
 *         required: true
 *         description: Identifiant MongoDB du commentaire
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Commentaire supprimé
 *       404:
 *         description: Tâche ou commentaire non trouvé
 *       400:
 *         description: ID invalide
 *
 * /api/authors:
 *   get:
 *     summary: Récupérer tous les auteurs
 *     description: Retourne la liste de tous les auteurs enregistrés
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Liste des auteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
