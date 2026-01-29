const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./swagger');

require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

const app = express();
app.use(cors());
app.use(express.json());

// --- SWAGGER DOCUMENTATION ---
app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- CONNEXION MONGODB ---
const mongoURL = process.env.DATABASE_URL;

mongoose.connect(mongoURL) 
  .then(() => console.log('MongoDB connecté'))
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err);
    process.exit(1);
  });

// --- ROUTES ---
app.use('/api/tasks', require('./routes/tasks.routes'));
app.use('/api/tasks', require('./routes/subtasks.routes'));
app.use('/api/tasks', require('./routes/comments.routes'));
app.use('/api/authors', require('./routes/author.routes'));


module.exports = app;
