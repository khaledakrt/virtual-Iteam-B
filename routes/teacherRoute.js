const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/register', teacherController.register);
router.post('/login', teacherController.login);
router.get('/:id', teacherController.getById);
router.get('/', teacherController.getTeachers);
router.post('/', teacherController.addTeacher);
router.put('/:id', teacherController.updateTeacher); // Add this line
router.delete('/:id', teacherController.deleteTeacher);
router.post('/deleteMany', teacherController.deleteTeachers);

module.exports = router;