const Admin = require('../models/Admin');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');


async function register(req, res) {
    console.log('herrre')
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hashPassword(password);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.comparePasswords(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.generateToken({ email: admin.email });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, login };
