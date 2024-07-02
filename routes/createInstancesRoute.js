const express = require('express');
const router = express.Router();
const createInstancesController = require('../controllers/createInstancesController'); // Import the controller

router.post('/', createInstancesController.createInstances);

module.exports = router;
