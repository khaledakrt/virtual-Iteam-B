const mongoose = require('mongoose');

const vmSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    private_ips: { type: String, default: '' }, // Make privateIps optional with a default value
    floating_ips: { type: String, default: '' } // Make floatingIps optional with a default value
});

const vm = mongoose.model('Vm', vmSchema);

module.exports = vm;