const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Route to create a new group
router.post('/groups', groupController.createGroup);

// Route to get all groups
router.get('/groups', groupController.getAllGroups);

// Route to get a single group by ID
router.get('/:id', groupController.getGroupById);

// Route to update a group by ID
router.put('/:id', groupController.updateGroup);

// Route to delete a group by ID
router.delete('/groups/:id', groupController.deleteGroup);

module.exports = router;
