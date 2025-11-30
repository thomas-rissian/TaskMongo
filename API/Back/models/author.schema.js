const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuteurSchema = new Schema({
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true }
}, { _id: false });

module.exports = AuteurSchema;