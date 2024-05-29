const mongoose = require('mongoose');

const vmSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    private_ips: { type: String, default: '' },
    floating_ips: { type: String, default: '' },
    status: { type: String, default: '' }

    
});

const Vm = mongoose.model('Vm', vmSchema);

module.exports = Vm;
