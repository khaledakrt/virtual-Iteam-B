const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const Teachers = require('../models/Teachers');



async function register(req, res) {
    console.log('herrre')
    try {
        const { nom, prenom, email, password, role, photo, specialite, classes,vms } = req.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        const newTeacher = new Teachers({ nom, prenom, email, password : hashedPassword, role, photo, specialite, classes,vms });
        await newTeacher.save();
        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        const teacher = await Teachers.findOne({ email: data.email });
        //const { email, password } = req.body;
        //const teacher = await findOne({ email });
        if (!teacher) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.comparePasswords(data.password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const tokenPayload = {
            email: teacher.email,
            _id: teacher._id, // Assuming this is the teacher's ID
            name: `${teacher.nom} ${teacher.prenom}`, // Combine first name and last name
            role: teacher.role // Assuming you have a 'role' field in your teachers schema
            // Add other fields as needed
        };
        const token = jwt.generateToken(tokenPayload);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Route to get a teacher by ID
async function getById (req, res) {
    const { id } = req.params;

    try {
        const teacher = await Teachers.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json(teacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
async function getTeachers   (req, res)  {
    try {
      const teachers = await Teachers.find();
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  async function addTeacher  (req, res) {
    const teacher = new Teachers({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      photo: req.body.photo,
      specialite: req.body.specialite,
      classes: req.body.classes,
      vms: req.body.vms,
    });
  
    try {
      const newTeacher = await teacher.save();
      res.status(201).json(newTeacher);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  async function  updateTeacher  (req, res)  {
    try {
      const updatedTeacher = await Teachers.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedTeacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json(updatedTeacher);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  async function  deleteTeacher  (req, res) {
    try {
      await Teachers.findByIdAndDelete(req.params.id);
      res.json({ message: 'Teacher deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  async function  deleteTeachers  (req, res)  {
    try {
      await Teachers.deleteMany({ _id: { $in: req.body.ids } });
      res.json({ message: 'Teachers deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
module.exports = { register, login,getById,getTeachers,addTeacher,updateTeacher,deleteTeacher,deleteTeachers};