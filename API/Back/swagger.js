/**
 * Configuration Swagger pour l'API TaskMongo
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskMongo API',
      version: '1.0.0',
      description: 'API de gestion des tâches avec MongoDB',
      contact: {
        name: 'Support API',
        email: 'support@taskmongo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        Author: {
          type: 'object',
          required: ['nom', 'email'],
          properties: {
            nom: {
              type: 'string',
              description: 'Nom de l\'auteur',
              example: 'Dupont'
            },
            prenom: {
              type: 'string',
              description: 'Prénom de l\'auteur',
              example: 'Jean'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'auteur',
              example: 'jean.dupont@example.com'
            }
          }
        },
        Subtask: {
          type: 'object',
          required: ['titre'],
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant MongoDB de la sous-tâche',
              example: '507f1f77bcf86cd799439011'
            },
            titre: {
              type: 'string',
              description: 'Titre de la sous-tâche',
              example: 'Implémenter la validation'
            },
            statut: {
              type: 'string',
              enum: ['Backlog', 'Ready', 'In progress', 'In review', 'Done'],
              default: 'Backlog',
              description: 'Statut de la sous-tâche'
            },
            echeance: {
              type: 'string',
              format: 'date-time',
              description: 'Date d\'échéance de la sous-tâche',
              example: '2026-02-15T10:00:00Z'
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['auteur', 'contenu'],
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant MongoDB du commentaire',
              example: '507f1f77bcf86cd799439012'
            },
            auteur: {
              $ref: '#/components/schemas/Author'
            },
            contenu: {
              type: 'string',
              description: 'Contenu du commentaire',
              minLength: 3,
              example: 'Cela doit être fait rapidement'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du commentaire',
              example: '2026-01-29T10:00:00Z'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['titre', 'auteur'],
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant MongoDB de la tâche',
              example: '507f1f77bcf86cd799439010'
            },
            titre: {
              type: 'string',
              description: 'Titre de la tâche',
              minLength: 3,
              example: 'Développer la nouvelle fonctionnalité'
            },
            description: {
              type: 'string',
              description: 'Description détaillée de la tâche',
              example: 'Implémenter le système de gestion des tâches'
            },
            priorite: {
              type: 'string',
              enum: ['Low', 'Medium', 'High', 'Critical'],
              default: 'Medium',
              description: 'Priorité de la tâche'
            },
            statut: {
              type: 'string',
              enum: ['Backlog', 'Ready', 'In progress', 'In review', 'Done'],
              default: 'Backlog',
              description: 'Statut de la tâche'
            },
            auteur: {
              $ref: '#/components/schemas/Author'
            },
            categorie: {
              type: 'string',
              description: 'Catégorie de la tâche',
              example: 'Développement'
            },
            etiquettes: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Étiquettes associées à la tâche',
              example: ['urgent', 'backend']
            },
            echeance: {
              type: 'string',
              format: 'date-time',
              description: 'Date d\'échéance de la tâche',
              example: '2026-02-28T23:59:59Z'
            },
            sousTaches: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Subtask'
              },
              description: 'Liste des sous-tâches'
            },
            commentaires: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Comment'
              },
              description: 'Liste des commentaires'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
              example: '2026-01-29T10:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification',
              example: '2026-01-29T15:30:00Z'
            }
          }
        },
        TaskCreateRequest: {
          type: 'object',
          required: ['titre', 'auteur'],
          properties: {
            titre: {
              type: 'string',
              description: 'Titre de la tâche',
              minLength: 3,
              example: 'Développer la nouvelle fonctionnalité'
            },
            description: {
              type: 'string',
              description: 'Description détaillée de la tâche'
            },
            priorite: {
              type: 'string',
              enum: ['Low', 'Medium', 'High', 'Critical'],
              default: 'Medium'
            },
            statut: {
              type: 'string',
              enum: ['Backlog', 'Ready', 'In progress', 'In review', 'Done'],
              default: 'Backlog'
            },
            auteur: {
              $ref: '#/components/schemas/Author'
            },
            categorie: {
              type: 'string'
            },
            etiquettes: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            echeance: {
              type: 'string',
              format: 'date-time'
            },
            sousTaches: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Subtask'
              }
            },
            commentaires: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Comment'
              }
            }
          }
        },
        TaskUpdateRequest: {
          type: 'object',
          properties: {
            titre: {
              type: 'string',
              description: 'Titre de la tâche',
              minLength: 3
            },
            description: {
              type: 'string'
            },
            priorite: {
              type: 'string',
              enum: ['Low', 'Medium', 'High', 'Critical']
            },
            statut: {
              type: 'string',
              enum: ['Backlog', 'Ready', 'In progress', 'In review', 'Done']
            },
            categorie: {
              type: 'string'
            },
            etiquettes: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            echeance: {
              type: 'string',
              format: 'date-time'
            },
            auteur: {
              $ref: '#/components/schemas/Author'
            },
            sousTaches: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Subtask'
              }
            },
            commentaires: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Comment'
              }
            }
          }
        },
        HistoryEntry: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Horodatage de la modification'
            },
            action: {
              type: 'string',
              enum: ['created', 'updated', 'deleted'],
              description: 'Type d\'action effectuée'
            },
            changes: {
              type: 'object',
              description: 'Détails des modifications'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            statusCode: {
              type: 'integer',
              description: 'Code de statut HTTP'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Détails des erreurs de validation'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, './routes/*.js'),
    path.join(__dirname, './swagger.routes.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};
