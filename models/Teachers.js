
// //Teachersmodel.js
// const mongoose = require('mongoose');

// const teachersSchema = new mongoose.Schema({
//     nom: { type: String, required: true },
//     prenom: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     role: { type: String },
//     photo: { type: String },
//     specialite: { type: String },
//     classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // Array of group IDs
//     // classes:{ type: String, required: true },
//     vms: { type: String},
// });

// module.exports = mongoose.model('teacher', teachersSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  classes: [{ type: String }] // Change the type to String array
});

const Teachers = mongoose.model('Teachers', teacherSchema);

module.exports = Teachers;
