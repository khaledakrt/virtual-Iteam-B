const teachers = require('../models/teachers');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const student = require('../models/students');


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
        const { email, password } = req.body;
        const teacher = await teachers.findOne({ email });
        if (!teachers) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.comparePasswords(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.generateToken({ email: teacher.email });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, login };
