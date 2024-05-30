//requestController.js
const Request = require('../models/Requests');

// Function to create a new request
exports.createRequest = async (req, res) => {
    const { senderName, groupe, nombreLabs, systemExploitation, baseDonnee, runTimeEnvironnement, webServer } = req.body;
    try {
        const newRequest = await Request.create({
            senderName,
            groupe,
            nombreLabs,
            systemExploitation,
            baseDonnee,
            runTimeEnvironnement,
            webServer
        });
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Function to get all requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
