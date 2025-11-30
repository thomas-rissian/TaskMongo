const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');

// GET /api/authors
router.get('/', authorController.getAllAuthors);

module.exports = router;