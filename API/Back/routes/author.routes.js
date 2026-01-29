const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Récupérer tous les auteurs
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Liste des auteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
router.get('/', authorController.getAllAuthors);

module.exports = router;