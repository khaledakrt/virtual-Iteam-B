const Students = require('../models/Students');
const Teachers = require('../models/Teachers');

const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const path = require('path');
const multer = require('multer');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Adjusted destination path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Function to handle student registration
async function register(req, res) {
  try {
    const { nom, prenom, email, password, role, classe, vms } = req.body;
    const hashedPassword = await bcrypt.hashPassword(password);

    // Check if a file was uploaded and prepare photo path
    const photoPath = req.file ? `uploads/${req.file.filename}` : '';
    
    const newStudent = new Students({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      photo: photoPath,
      classe,
      vms
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: error.message });
  }
}

// Function to handle student login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const student = await Students.findOne({ email });

    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.comparePasswords(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokenPayload = {
      email: student.email,
      _id: student._id,
      name: `${student.nom} ${student.prenom}`,
      role: student.role
      // Add other necessary fields
    };

    const token = jwt.generateToken(tokenPayload);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: error.message });
  }
}

// Function to get student by ID
async function getById(req, res) {
  const { id } = req.params;

  try {
    const student = await Students.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Function to get all students
async function getStudents(req, res) {
  try {
    const students = await Students.find();
    res.json(students);
  } catch (error) {
    console.error('Error in getStudents:', error);
    res.status(500).json({ message: error.message });
  }
}

// Function to add a new student
async function addStudent(req, res) {
  const { nom, prenom, email, password, role, classe, vms } = req.body;

  const student = new Students({
    nom,
    prenom,
    email,
    password,
    role,
    classe,
    vms
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error in addStudent:', error);
    res.status(400).json({ message: error.message });
  }
}

// Function to update a student by ID
async function updateStudent(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedStudent = await Students.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error in updateStudent:', error);
    res.status(400).json({ message: error.message });
  }
}

// Function to delete a student by ID
async function deleteStudent(req, res) {
  const { id } = req.params;

  try {
    await Students.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error in deleteStudent:', error);
    res.status(500).json({ message: error.message });
  }
}

// Function to delete multiple students by IDs
async function deleteStudents(req, res) {
  const { ids } = req.body;

  try {
    await Students.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Students deleted' });
  } catch (error) {
    console.error('Error in deleteStudents:', error);
    res.status(500).json({ message: error.message });
  }
}

// Function to get student count based on query parameters
async function getStudentCount(req, res) {
  try {
    const { classe, role, vms } = req.query;

    const studentCount = await Students.countDocuments({ role, classe, vms });
    res.json({ studentCount });
  } catch (error) {
    console.error('Error in getStudentCount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to get teachers by student group
async function getTeachersByStudentGroup(req, res) {
  const { studentGroup } = req.query;

  try {
    const teachers = await Teachers.find({ classes: studentGroup });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
async function getStudentsByTeacherCriteria(req, res) {
  const { role, classe, vms } = req.query;

  try {
    const teachers = await Teachers.find({
      classes: {
        $elemMatch: {
          $regex: `${classe}.*${role}.*${vms}`,
          $options: 'i'
        }
      }
    });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found for the given criteria' });
    }

    const teacherIds = teachers.map(teacher => teacher._id);

    const students = await Students.find({
      $or: [
        { classe, role, vms, teacher: { $in: teacherIds } }
      ]
    });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found for the given criteria' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students by criteria:', error); // Log the full error object
    res.status(500).json({ message: 'Server Error' });
  }
}
async function getStudentsByGroup(req, res) {
  const { role, classe, vms } = req.query;

  try {
    console.log(`Searching for teachers with classes matching: ${classe}, ${role}, ${vms}`);

    // Query teachers based on the classes array matching the criteria
    const teachers = await Teacher.find({
      classes: {
        $elemMatch: {
          $regex: `${classe}.*${role}.*${vms}`,  // Using regex to match the pattern
          $options: 'i'  // Case-insensitive
        }
      }
    });

    if (!teachers || teachers.length === 0) {
      console.log('No teachers found for the given criteria');
      return res.status(404).json({ message: 'No teachers found for the given criteria' });
    }

    // Extract teacher IDs from the matched teachers
    const teacherIds = teachers.map(teacher => teacher._id);

    // Query students based on role, classe, vms and teacher IDs
    const students = await Student.find({
      $or: [
        { classe: new RegExp(classe, 'i') },
        { role: new RegExp(role, 'i') },
        { vms: new RegExp(vms, 'i') },
        { teacher: { $in: teacherIds } }  // Assuming you have a teacher field in students referencing teachers
      ]
    });

    // Return JSON response with students
    res.json(students);
  } catch (err) {
    console.error('Error fetching students by group:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  getById,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  deleteStudents,
  getStudentCount,
  getTeachersByStudentGroup,
  getStudentsByTeacherCriteria,
  getStudentsByGroup,
  upload // Exporting multer upload middleware
};
