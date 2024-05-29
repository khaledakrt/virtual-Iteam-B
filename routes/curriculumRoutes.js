const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');

// Define routes using the curriculumController APIs
router.use('/curriculum', curriculumController);

module.exports = router;
