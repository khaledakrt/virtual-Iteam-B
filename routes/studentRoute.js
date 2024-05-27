const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/register', studentController.register);
router.post('/login', studentController.login);
router.get('/:id', studentController.getById);
router.get('/', studentController.getStudents);
router.post('/', studentController.addStudent);
router.put('/:id', studentController.updateStudent); // Add this line
router.delete('/:id', studentController.deleteStudent);
router.post('/deleteMany', studentController.deleteStudents);


module.exports = router;