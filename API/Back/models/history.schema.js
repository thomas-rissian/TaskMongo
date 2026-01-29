const mongoose = require('mongoose');
const { Schema } = mongoose;

const HistoriqueSchema = new Schema({
    champModifie: { type: String, required: true },
    ancienneValeur: { type: Schema.Types.Mixed },
    nouvelleValeur: { type: Schema.Types.Mixed },
    date: { type: Date, default: Date.now }
}, { _id: true });

module.exports = HistoriqueSchema;