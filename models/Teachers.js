const mongoose = require('mongoose');

const teachersSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String, required: true },
    specialite: { type: String, required: true },
    classes: { type: String, required: true },
    vms: { type: String, required: true },
});

module.exports = mongoose.model('teacher', teachersSchema);
