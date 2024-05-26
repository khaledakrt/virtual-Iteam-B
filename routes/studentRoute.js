const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const getstudentController = require('../controllers/getstudentController');


router.post('/register', studentController.register);
router.post('/login', studentController.login);
router.post('/getStudent', getstudentController.getStudent);
module.exports = router;