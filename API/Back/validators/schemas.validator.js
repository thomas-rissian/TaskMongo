const { z } = require('zod');

// ===========================
// SCHÉMAS ZOD POUR VALIDATION
// ===========================

/**
 * Schéma pour les auteurs
 */
const AuthorSchema = z.object({
  nom: z.string().trim().min(1, 'Le nom est requis'),
  prenom: z.string().trim().optional(),
  email: z.string().email('Email invalide')
});

/**
 * Schéma pour les sous-tâches
 */
const SubtaskSchema = z.object({
  _id: z.string().optional().nullable(),
  titre: z.string().trim().min(1, 'Le titre de la sous-tâche est requis'),
  statut: z.enum(['Backlog', 'Ready', 'In progress', 'In review', 'Done']).default('Backlog'),
  echeance: z.string().datetime().optional().nullable()
});

/**
 * Schéma pour les commentaires
 */
const CommentSchema = z.object({
  _id: z.string().optional().nullable(),
  auteur: AuthorSchema,
  contenu: z.string().trim().min(1, 'Le commentaire ne peut pas être vide').min(3, 'Le commentaire doit avoir au moins 3 caractères'),
  date: z.string().datetime().optional()
});

/**
 * Schéma pour la création d'une tâche (CREATE)
 */
const TaskCreateSchema = z.object({
  titre: z.string().trim().min(1, 'Le titre est requis').min(3, 'Le titre doit avoir au moins 3 caractères'),
  description: z.string().trim().optional(),
  priorite: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  statut: z.enum(['Backlog', 'Ready', 'In progress', 'In review', 'Done']).default('Backlog'),
  auteur: AuthorSchema,
  categorie: z.string().trim().optional(),
  etiquettes: z.array(z.string()).default([]),
  echeance: z.string().datetime().optional().nullable(),
  sousTaches: z.array(SubtaskSchema).optional(),
  commentaires: z.array(CommentSchema).optional()
});

/**
 * Schéma pour la modification d'une tâche (UPDATE)
 * Tous les champs sont optionnels
 */
const TaskUpdateSchema = z.object({
  titre: z.string().trim().min(3, 'Le titre doit avoir au moins 3 caractères').optional(),
  description: z.string().trim().optional(),
  priorite: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  statut: z.enum(['Backlog', 'Ready', 'In progress', 'In review', 'Done']).optional(),
  categorie: z.string().trim().optional(),
  etiquettes: z.array(z.string()).optional(),
  echeance: z.string().datetime().optional().nullable(),
  auteur: AuthorSchema.optional(),
  sousTaches: z.array(SubtaskSchema).optional(),
  commentaires: z.array(CommentSchema).optional()
}).strict(); // Rejette les propriétés supplémentaires

/**
 * Schéma pour les filtres/recherche
 */
const TaskFilterSchema = z.object({
  statut: z.enum(['Backlog', 'Ready', 'In progress', 'In review', 'Done']).optional(),
  priorite: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  categorie: z.string().trim().optional(),
  etiquette: z.string().trim().optional(),
  avant: z.string().datetime().optional(),
  apres: z.string().datetime().optional(),
  q: z.string().trim().optional(),
  tri: z.string().optional(),
  ordre: z.enum(['asc', 'desc']).optional()
});

/**
 * Schéma pour l'ID MongoDB
 */
const MongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID MongoDB invalide');

// ===========================
// EXPORTS
// ===========================
module.exports = {
  AuthorSchema,
  SubtaskSchema,
  CommentSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
  TaskFilterSchema,
  MongoIdSchema
};
