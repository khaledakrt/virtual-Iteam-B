//requestRoute.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// API endpoint to create a request
router.post('/', requestController.createRequest);

// API endpoint to get all requests
router.get('/', requestController.getAllRequests);

module.exports = router;

