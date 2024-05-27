//const teachers = require('../models/Teachers');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const Teachers = require('../models/Teachers');



async function register(req, res) {
    console.log('herrre')
    try {
        const { nom, prenom, email, password, role, photo, specialite, classes,vms } = req.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        const newteacher = new teachers({ nom, prenom, email, password : hashedPassword, role, photo, specialite, classes,vms });
        await newteacher.save();
        res.status(201).json({ message: 'teacher registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        const teacher = await teachers.findOne({ email: data.email });
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
};

module.exports = { register, login,getById };
