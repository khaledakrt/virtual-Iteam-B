// src/app/demo/models/Requests.ts

const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    senderName: { type: String, },
    groupe: { type: String, },
    nombreLabs: { type: String, },
    systemExploitation: { type: String, },
    baseDonnee: { type: String, },
    runTimeEnvironnement: { type: String, },
    webServer: { type: String, }
});

module.exports = mongoose.model('Request', requestSchema);
