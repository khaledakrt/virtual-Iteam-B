//teacherRoute.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const upload = require('../helpers/multerConfig');

router.post('/register', upload.single('photo'), teacherController.register);
router.post('/login', teacherController.login);
router.get('/:id', teacherController.getById);
router.get('/', teacherController.getTeachers);
router.post('/', upload.single('photo'), teacherController.addTeacher); // Ensure this route uses upload middleware
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);
router.post('/deleteMany', teacherController.deleteTeachers);

module.exports = router;
