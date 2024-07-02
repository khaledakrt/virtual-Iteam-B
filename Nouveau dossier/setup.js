require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const Speciality = require('../models/Speciality');
const Level = require('../models/Level');
const Course = require('../models/Course');

async function setup() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Define specialities, levels, and courses
        const specialities = ['Cloud Computing & DevOps', 'Big Data', 'Cyber Security'];
        const levels = ['1st Year', '2nd Year', '3rd Year'];
        const courses = [
            { name: 'Cloud', specialityIndex: 0, levelIndex: 0 },
            { name: 'DevOps', specialityIndex: 0, levelIndex: 0 },
            { name: 'Network', specialityIndex: 0, levelIndex: 0 },
            { name: 'Big Data', specialityIndex: 1, levelIndex: 0 }
            // Add more courses as needed
        ];

        // Create specialities
        const specialityIds = await Promise.all(specialities.map(name => createSpeciality(name)));

        // Create levels
        const levelIds = await Promise.all(levels.map(name => createLevel(name)));

        // Create courses
        await Promise.all(courses.map(course => createCourse(course.name, specialityIds[course.specialityIndex], levelIds[course.levelIndex])));

        console.log('Setup completed successfully.');
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

async function createSpeciality(name) {
    const speciality = new Speciality({ name });
    await speciality.save();
    return speciality._id;
}

async function createLevel(name) {
    const level = new Level({ name });
    await level.save();
    return level._id;
}

async function createCourse(name, specialityId, levelId) {
    const course = new Course({ name, speciality_id: specialityId, level_id: levelId });
    await course.save();
    return course._id;
}

// Run the setup function
setup();
