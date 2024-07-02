const mongoose = require('mongoose');

const create_instancesSchema = new mongoose.Schema({
    Id_student: { type: String },
    id_specialite: { type: String, required: true },
    id_group: { type: String, required: true },
    id_niveau: { type: String, required: true },
    id_instance: { type: String, required: true }
});

module.exports = mongoose.model('create_instance', create_instancesSchema);
 



