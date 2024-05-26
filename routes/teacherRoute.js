const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const getteacherController = require('../controllers/getteacherController');

router.post('/register', teacherController.register);
router.post('/login', teacherController.login);
router.post('/getteacher', getteacherController.getteacher);

module.exports = router;