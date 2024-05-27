const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/register', teacherController.register);
router.post('/login', teacherController.login);
router.get('/:id', teacherController.getById);

module.exports = router;