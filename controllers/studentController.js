const Students = require('../models/Students');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');



async function register(req, res) {
    console.log('herrre')
    try {
        const { nom, prenom, email, password, role, photo, classe, vms } = req.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        const newStudent = new Students({ nom, prenom, email, password: hashedPassword, role, photo, classe, vms });
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
            _id: student._id, // Assuming this is the teacher's ID
            name: `${student.nom} ${student.prenom}`, // Combine first name and last name
            role: student.role // Assuming you have a 'role' field in your teachers schema
            // Add other fields as needed
        };
        const token = jwt.generateToken(tokenPayload);
        res.status(200).json({ token });
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Route to get a teacher by ID
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
};

module.exports = { register, login, getById };
