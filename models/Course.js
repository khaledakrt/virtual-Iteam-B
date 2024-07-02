const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    speciality_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Speciality' },
    level_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
