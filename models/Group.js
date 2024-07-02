const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', // Reference to the Teacher model
        
    },
    level: { type: String, required: true },
    specialty: { type: String, required: true },
    number: { type: String, required: true }
});

module.exports = mongoose.model('Group', groupSchema);
