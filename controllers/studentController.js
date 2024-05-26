const Students = require('../models/students');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const students = require('../models/students');


async function register(req, res) {
    console.log('herrre')
    try {
        const { nom, prenom, email, password, role, photo, classe,vms } = req.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        const newStudent = new Students({nom, prenom, email, password, role,photo, classe,vms: hashedPassword });
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const Student = await students.findOne({ email });
        if (!students) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.comparePasswords(password, Student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.generateToken({ email: Student.email });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, login };
