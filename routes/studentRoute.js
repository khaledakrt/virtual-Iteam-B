const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../helpers/multerConfig');
const { getStudentsByGroup } = require('../controllers/studentController'); // Import directly

router.post('/register', upload.single('photo'), studentController.register);
router.post('/login', studentController.login);
router.get('/count', studentController.getStudentCount); // Define /count route before /:id route

router.get('/:id', studentController.getById);
router.get('/', studentController.getStudents);
router.post('/', upload.single('photo'), studentController.addStudent);
router.put('/:id', studentController.updateStudent); // Add this line
router.delete('/:id', studentController.deleteStudent);
router.post('/deleteMany', studentController.deleteStudents);

// Define the route for getTeachersByStudentGroup
router.get('/teachers', studentController.getTeachersByStudentGroup);

router.get('/students/group', studentController.getStudentsByTeacherCriteria);
router.get('/student/students/group', async (req, res) => {
    await studentController.getStudentsByGroup(req, res);
  });

  router.get('/students/group', getStudentsByGroup);

module.exports = router;
