# Configuration Swagger pour TaskMongo API

## 🚀 Installation rapide

### Étape 1 : Installer les dépendances Swagger
```bash
cd API
npm install swagger-jsdoc swagger-ui-express
```

### Étape 2 : Vérifier l'installation
```bash
npm install
```

### Étape 3 : Démarrer le serveur
```bash
npm start
# ou pour le développement avec hot-reload:
npm run dev
```

### Étape 4 : Accéder à la documentation
Ouvrez votre navigateur et allez à :
```
http://localhost:3000/api-docs
```

---

## 📋 Fichiers créés/modifiés

### Nouveaux fichiers :
- **`Back/swagger.js`** - Configuration Swagger avec schémas OpenAPI 3.0
- **`Back/swagger.routes.js`** - Documentation détaillée des endpoints avec exemples
- **`Back/swagger.json`** - Fichier de configuration Swagger (statique)
- **`Back/SWAGGER_DOCUMENTATION.md`** - Guide complet de la documentation

### Fichiers modifiés :
- **`Back/app.js`** - Ajout de l'intégration Swagger
- **`package.json`** - Ajout de `swagger-jsdoc` comme dépendance

---

## 📚 Fonctionnalités de la documentation

La documentation Swagger inclut :

### ✅ Tous les endpoints avec :
- Description détaillée
- Paramètres d'entrée documentés
- Schémas de requête et réponse
- Exemples de requêtes et réponses
- Codes de statut HTTP

### ✅ Schémas de données :
- **Task** - Structure complète d'une tâche
- **TaskCreateRequest** - Schéma pour la création
- **TaskUpdateRequest** - Schéma pour la mise à jour
- **Subtask** - Structure d'une sous-tâche
- **Comment** - Structure d'un commentaire
- **Author** - Structure d'un auteur
- **HistoryEntry** - Structure d'une entrée d'historique
- **Error** - Structure standard des erreurs

### ✅ Interface Swagger UI interactive :
- Essayer les endpoints directement
- Valider les payloads
- Voir les réponses en temps réel

---

## 🔧 Configuration avancée

### Ajouter d'autres serveurs

Modifiez `swagger.js` et ajoutez dans le tableau `servers` :
```javascript
{
  url: "https://staging.api.taskmongo.com",
  description: "Serveur de staging"
}
```

### Ajouter une authentification

Ajoutez dans `swagger.js` sous `components` :
```javascript
securitySchemes: {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
}
```

### Exporter la documentation

La documentation est disponible en plusieurs formats :
- **UI interactive** : `http://localhost:3000/api-docs`
- **JSON** : `http://localhost:3000/api-docs.json`
- **YAML** : `http://localhost:3000/api-docs.yaml`

---

## 🐛 Troubleshooting

### Erreur : "Cannot find module 'swagger-jsdoc'"
```bash
npm install swagger-jsdoc
```

### Erreur : "Cannot find module 'swagger-ui-express'"
```bash
npm install swagger-ui-express
```

### La documentation n'apparaît pas
- Assurez-vous que le serveur écoute sur le port 3000
- Vérifiez que les modules sont correctement installés
- Redémarrez le serveur avec `npm start`

---

## 📖 Ressources

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Documentation](https://github.com/swagger-api/swagger-ui)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)

---

## ✨ Prochaines étapes

1. **Ajouter des tests** - Utilisez la documentation pour valider vos tests
2. **Ajouter l'authentification** - Implementez JWT ou OAuth2
3. **Versioning** - Préparez-vous pour v2.0
4. **Monitoring** - Suivez les appels API avec les métriques
5. **Documentation client** - Générez des SDK côté client à partir de Swagger

---

**Créé le** : 29 janvier 2026  
**Dernière mise à jour** : 29 janvier 2026
