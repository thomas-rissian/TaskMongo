const mongoose = require('mongoose');
const { Schema } = mongoose;
const AuteurSchema = require('./author.schema');
const HistoriqueSchema = require('./history.schema');

const SousTacheSchema = new Schema({
    titre: { type: String, required: true, trim: true },
    statut: { type: String, enum: ['Backlog', 'Ready', 'In progress', 'In review', 'Done'], default: 'Backlog' },
    echeance: { type: Date }
}, { _id: true });

const CommentaireSchema = new Schema({
    auteur: { type: AuteurSchema, required: true },
    date: { type: Date, default: Date.now },
    contenu: { type: String, required: true }
}, { _id: true });

const TaskSchema = new Schema({
    titre: { type: String, required: true, trim: true },
    description: { type: String },
    dateCreation: { type: Date, default: Date.now },
    echeance: { type: Date },
    statut: { type: String, enum: ['Backlog', 'Ready', 'In progress', 'In review', 'Done'], default: 'Backlog' },
    priorite: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    auteur: { type: AuteurSchema, required: true },
    categorie: { type: String },
    etiquettes: { type: [String], default: []},
    sousTaches: [SousTacheSchema],
    commentaires: [CommentaireSchema],
    historiqueModifications: [HistoriqueSchema]
}, { timestamps: true });

TaskSchema.index({ titre: 'text', description: 'text'});
module.exports = mongoose.model('Task', TaskSchema);