# TaskMongo - Gestionnaire de tâches MongoDB + Node.js + Angular

Application complète de gestion de tâches utilisant **MongoDB**, **Express.js**, et **Angular 21**.

## 📚 Documentation

| Document | Objectif |
|----------|----------|
| **[Context.md](./Context.md)** | Cahier des charges complet |
| **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** | État d'avancement détaillé + structure complète |
| **[ORCHESTRATION.md](./ORCHESTRATION.md)** | Comment tout fonctionne ensemble + patterns |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Documentation API complète + exemples cURL |
| **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** | Guide pour finir les composants Angular |
| **[BOARD_VIEW_IMPROVEMENTS.md](./BOARD_VIEW_IMPROVEMENTS.md)** | ⭐ Kanban UI: Drag-drop, checkboxes, layout fixe |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | Guide de test quick (15 min) |

> 💡 **Commencez par [PROJECT_STATUS.md](./PROJECT_STATUS.md)** pour une vue d'ensemble!  
> 🎯 **Nouveau**: Améliorations Board [BOARD_VIEW_IMPROVEMENTS.md](./BOARD_VIEW_IMPROVEMENTS.md)

---

## 🚀 Démarrage rapide

### Backend

```bash
cd API

# Configuration
echo 'DATABASE_URL = "mongodb://localhost:27017/taskmongo"' > .env

# Installation
npm install

# Démarrage
npm run dev     # Mode développement (nodemon)
npm run start   # Mode production
```

**API disponible**: `http://localhost:3000`

### Frontend

```bash
cd Front

# Installation dépendances Angular globales
npm install -g @angular/cli

# Installation du projet
npm install

# Démarrage
npm run start
```

**App disponible**: `http://localhost:4200`

---

## ✨ Fonctionnalités principales

### ✅ Implémentées

- **CRUD complet** - Créer/lire/modifier/supprimer tâches
- **Filtrage avancé** - Statut, priorité, catégorie, étiquette, dates, texte libre
- **Tri paramétrisable** - Par date, priorité, échéance (asc/desc)
- **Sous-tâches** - Gestion complète des sous-tâches
- **Commentaires** - Ajout/suppression de commentaires
- **Historique** - Suivi des modifications
- **Auteurs** - Gestion des auteurs uniques
- **Board Kanban** - Vue par statut
- **Interface Angular** - Composants modernes et réactifs

### 🔧 À améliorer

- [ ] Panneau de filtrage UI complet ([voir guide](./FRONTEND_GUIDE.md))
- [ ] Page détail tâche complète
- [ ] Validations côté client avancées
- [ ] Gestion des erreurs avec toasts/snackbars
- [ ] Pagination pour grandes listes
- [ ] Tests unitaires
- [ ] Responsive design complet

---

## 📡 API Quick Reference

### Tâches
```bash
# Récupérer toutes
GET /api/tasks

# Filtrer & trier
GET /api/tasks/search?statut=In progress&priorite=High&tri=echeance&ordre=desc

# Créer
POST /api/tasks { titre, auteur, ... }

# Détail
GET /api/tasks/:id

# Mettre à jour
PUT /api/tasks/:id { statut, priorite, ... }

# Supprimer
DELETE /api/tasks/:id

# Historique
GET /api/tasks/:id/history
```

### Sous-tâches
```bash
POST   /api/tasks/:id/sousTaches
PUT    /api/tasks/:id/sousTaches/:sid
DELETE /api/tasks/:id/sousTaches/:sid
```

### Commentaires
```bash
POST   /api/tasks/:id/commentaires
DELETE /api/tasks/:id/commentaires/:cid
```

**[👉 Documentation complète](./API_DOCUMENTATION.md)**

---

## 🏗️ Architecture

```
Backend (Express + Mongoose)
├── Routes (RESTful)
├── Controllers (Logique métier)
├── Models (MongoDB Schemas)
└── Utils (Historique, etc)
           ↓ HTTP/JSON
Frontend (Angular 21 + RxJS)
├── Pages (Board, Detail)
├── Components (Formulaires, Filtres)
├── Services (HTTP Client)
└── Models (TypeScript interfaces)
           ↓ Mongoose ODM
Database (MongoDB)
```

**[👉 Voir ORCHESTRATION.md pour détails](./ORCHESTRATION.md)**

---

## 📦 Stack technologique

| Partie | Technologie | Version |
|--------|-------------|---------|
| **Backend** | Node.js + Express | 5.1 |
| **ORM** | Mongoose | 8.20 |
| **Frontend** | Angular | 21 |
| **Styling** | SCSS | latest |
| **Database** | MongoDB | 4.4+ |
| **Dev Tools** | Nodemon | 3.1 |

---

## 🛠️ Développement

### Ajouter une nouvelle route API

1. Créer la méthode dans `API/Back/controllers/`
2. Ajouter la route dans `API/Back/routes/`
3. Créer/mettre à jour le service Angular

### Ajouter un composant Angular

```bash
cd Front
ng generate component my-component --skip-tests
```

Puis importer dans le composant parent (standalone):
```typescript
imports: [..., MyComponent]
```

---

## 📝 Notes importantes

- ✅ API accepte les requêtes CORS (développement)
- ✅ Authentification non requise (scope du projet)
- ⚠️ Pas de pagination implémentée (attention avec grandes bases)
- 💡 Recherche texte utilise index MongoDB pour perfs

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Vérifier MongoDB
mongosh
# ou
mongo
```

### "CORS blocked"
API est configurée pour accepter tous les domaines en dev:
```javascript
app.use(cors());
```

### Port déjà utilisé
```bash
# Changer le port
PORT=3001 npm run dev
```

### Angular build error
```bash
npm install
npm run build
```

---

## 🤝 Contribuer

Les fichiers de suivi pour continuer le développement:

1. **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Composants à créer
2. **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Checklist des features
3. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Specs API

---

## 📧 Support

Consulter la documentation:
- **Questions API** → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Architecture** → [ORCHESTRATION.md](./ORCHESTRATION.md)
- **Avancement** → [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Frontend à finir** → [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)

---

## 📄 Licence

Projet BUT3 - Usage éducatif

---

**Version**: 1.0 RC  
**Dernière mise à jour**: Janvier 2026  
**Statut**: En finalisation
