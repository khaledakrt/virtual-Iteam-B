const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../helpers/multerConfig');

router.post('/register', upload.single('photo'), studentController.register);
router.post('/login', studentController.login);
router.get('/count', studentController.getStudentCount); // Define /count route before /:id route

router.get('/:id', studentController.getById);
router.get('/', studentController.getStudents);
router.post('/', upload.single('photo'), studentController.addStudent);
router.put('/:id', studentController.updateStudent); // Add this line
router.delete('/:id', studentController.deleteStudent);
router.post('/deleteMany', studentController.deleteStudents);


module.exports = router;