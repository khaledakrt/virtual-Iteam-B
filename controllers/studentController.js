const Students = require('../models/Students');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

async function register(req, res) {
    console.log('herrre')
    try {
        const { nom, prenom, email, password, role, classe, vms } = req.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        
        //const newStudent = new Students({ nom, prenom, email, password: hashedPassword, role, photo, classe, vms });
        // Check if a photo was uploaded
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
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        const student = await Students.findOne({ email: data.email });        
        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.comparePasswords(data.password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const tokenPayload = {
            email: student.email,
            _id: student._id, // Assuming this is the student's ID
            name: `${student.nom} ${student.prenom}`, // Combine first name and last name
            role: student.role // Assuming you have a 'role' field in your students schema
            // Add other fields as needed
        };
        const token = jwt.generateToken(tokenPayload);
        res.status(200).json({ token });
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Route to get a student by ID
async function getById (req, res) {
    const { id } = req.params;

    try {
        const student = await Students.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }    
}
async function getStudents   (req, res)  {
    try {
      const students = await Students.find();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  async function addStudent  (req, res) {
    const student = new Students({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      photo: req.body.photo,
      classe: req.body.classes,
      vms: req.body.vms,
    });
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    };
    async function  updateStudent  (req, res)  {
        try {
          const updatedStudent = await Students.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
          );
          if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
          }
          res.json(updatedStudent);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      };
      async function  deleteStudent  (req, res) {
        try {
          await Students.findByIdAndDelete(req.params.id);
          res.json({ message: 'Student deleted' });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      };
      async function  deleteStudents  (req, res)  {
        try {
          await Students.deleteMany({ _id: { $in: req.body.ids } });
          res.json({ message: 'Students deleted' });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      };
      async function getStudentCount(req, res) {
        try {
            console.log("Query Parameters:", req.query);
            const { classe, role, vms } = req.query;
            console.log("Classe:", classe);
            console.log("Role:", role);
            console.log("VMS:", vms);
            
            const studentCount = await Students.countDocuments({ role, classe, vms });
            console.log("Student Count:", studentCount);
            
            res.json({ studentCount });
        } catch (error) {
            console.error("Error in getStudentCount:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

        
    }
    
        
      
      
      
module.exports = { register, login, getById, getStudents, addStudent, updateStudent, getStudentCount, deleteStudent, deleteStudents, upload};
