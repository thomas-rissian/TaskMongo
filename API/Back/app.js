const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tasksRouter = require('./routes/tasks');
// const swaggerUi = require('swagger-ui-express');
// const openapi = require('./docs/openapi.json');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONNEXION MONGODB ---
const mongoURL = 'mongodb://localhost:27017/taskmongo';
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => {
  console.error('❌ Erreur connexion MongoDB:', err);
  process.exit(1); // quitte si la connexion échoue
});

// // route racine simple (ou rediriger vers /docs)
// app.get('/', (req, res) => {
//   // Option A: message simple
//   // res.send('API TaskMongo — voir /docs pour la documentation');

//   // Option B: redirection vers Swagger UI si installé
//   res.redirect('/docs');
// });

app.use('/api/tasks', tasksRouter);
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

module.exports = app;
