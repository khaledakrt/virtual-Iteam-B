
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminroute');
const studentRoutes = require('./routes/studentRoute');
const teacherRoutes = require('./routes/teacherRoute');
const vmsRoutes = require('./routes/vmsRoute');
const cors = require('cors');


const app = express();
require('dotenv').config();

// Autoriser les requêtes de votre frontend
const corsOptions = {
    origin: 'http://localhost:4200', // Adresse de votre frontend
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware for parsing JSON bodies
app.use(express.json());

// Route for admin operations
app.use('/admin', adminRoutes);

// Route for student operations
app.use('/student', studentRoutes);

// Route for teacher operations
app.use('/teacher', teacherRoutes);

// services for vms operations
//app.use('/vms', syncRoute)
app.use('/vms', vmsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
