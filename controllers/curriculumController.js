const express = require('express');
const router = express.Router();
const Speciality = require('../models/Speciality');
const Level = require('../models/Level');
const Course = require('../models/Course');

// API endpoint to get all specialities
router.get('/specialities', async (req, res) => {
    try {
        const specialities = await Speciality.find();
        res.json(specialities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to create a speciality
router.post('/specialities', async (req, res) => {
    const speciality = new Speciality({
        name: req.body.name
    });
    try {
        const newSpeciality = await speciality.save();
        res.status(201).json(newSpeciality);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API endpoint to get all levels
router.get('/levels', async (req, res) => {
    try {
        const levels = await Level.find();
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to create a level
router.post('/levels', async (req, res) => {
    const level = new Level({
        name: req.body.name
    });
    try {
        const newLevel = await level.save();
        res.status(201).json(newLevel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API endpoint to get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to create a course
router.post('/courses', async (req, res) => {
    const course = new Course({
        name: req.body.name,
        speciality_id: req.body.speciality_id,
        level_id: req.body.level_id
    });
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
