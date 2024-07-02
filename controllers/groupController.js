const Group = require('../models/Group');

async function createGroup(req, res) {
    try {
        const group = new Group(req.body);
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllGroups(req, res) {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getGroupById(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateGroup(req, res) {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteGroup(req, res) {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup };
