const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const Teachers = require('../models/Teachers');
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

// Function to register a new teacher
async function register(req, res) {
  try {
    const { nom, prenom, email, password, classes } = req.body;
    const hashedPassword = await bcrypt.hashPassword(password);

    // Check if a photo was uploaded
    const photoPath = req.file ? `uploads/${req.file.filename}` : '';

    const newTeacher = new Teachers({
      nom,
      prenom,
      email,
      password: hashedPassword,
      photo: photoPath,
      classes
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: error.message });
  }
}

// Function to handle teacher login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const teacher = await Teachers.findOne({ email });

    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.comparePasswords(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokenPayload = {
      email: teacher.email,
      _id: teacher._id,
      name: `${teacher.nom} ${teacher.prenom}`
      // Add other necessary fields
    };

    const token = jwt.generateToken(tokenPayload);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: error.message });
  }
}

// Function to get teacher by ID
async function getById(req, res) {
  const { id } = req.params;

  try {
    const teacher = await Teachers.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Function to get all teachers
async function getTeachers(req, res) {
  try {
    const teachers = await Teachers.find();
    res.json(teachers);
  } catch (error) {
    console.error('Error in getTeachers:', error);
    res.status(500).json({ message: error.message });
  }
}

// Function to add a new teacher
async function addTeacher(req, res) {
  const { nom, prenom, email, password, classes } = req.body;

  const hashedPassword = await bcrypt.hashPassword(password);
  const photoPath = req.file ? `uploads/${req.file.filename}` : '';

  const newTeacher = new Teachers({
    nom,
    prenom,
    email,
    password: hashedPassword,
    photo: photoPath,
    classes,
  });

  try {
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Error in addTeacher:', error);
    res.status(400).json({ message: error.message });
  }
}

// Function to update a teacher by ID
async function updateTeacher(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTeacher = await Teachers.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error in updateTeacher:', error);
    res.status(400).json({ message: error.message });
  }
}

// Function to delete a teacher by ID
async function deleteTeacher(req, res) {
  const { id } = req.params;

  try {
    await Teachers.findByIdAndDelete(id);
    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    console.error('Error in deleteTeacher:', error);
    res.status(500).json({ message: error.message });
  }
}

// Function to delete multiple teachers by IDs
async function deleteTeachers(req, res) {
  const { ids } = req.body;

  try {
    await Teachers.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Teachers deleted' });
  } catch (error) {
    console.error('Error in deleteTeachers:', error);
    res.status(500).json({ message: error.message });
  }
}
// Function to fetch teachers based on student criteria
async function getTeachersByCriteria(req, res) {
  const { role, classe, vms } = req.query; // Extraire les critères de la requête
  const studentCriteria = { role, classe, vms }; // Critères de l'étudiant

  try {
    // Requête pour trouver les professeurs dont les classes correspondent aux critères de l'étudiant
    const teachers = await Teachers.find({
      $or: [
        // Vérifier que le professeur a exactement le même groupe que l'étudiant
        {
          classes: {
            $elemMatch: {
              $regex: `${classe}.*${role}.*${vms}`, // Correspondance exacte des trois critères dans la phrase de trois mots
              $options: 'i' // Options pour l'expression régulière (insensible à la casse)
            }
          }
        },
        // Autres critères spécifiques aux enseignants, basés sur votre modèle Teacher
        {
          // Ajoutez ici d'autres critères spécifiques aux enseignants si nécessaire
        }
      ]
    });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'Aucun professeur trouvé correspondant aux critères' });
    }

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Erreur dans getTeachersByCriteria:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
}

module.exports = {
  register,
  login,
  getById,
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  deleteTeachers,
  getTeachersByCriteria,
  upload // Exporting multer upload middleware
};
