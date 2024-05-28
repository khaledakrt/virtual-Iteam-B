const express = require('express');
const router = express.Router();
const vmController = require('../controllers/vmController');

router.get('/sync-data', async (req, res) => {
    try {
        const authToken = 'gAAAAABmVhY8WhBtRmeK6LRuAr9FXv3JOw4WQkTm8PTY_kGq-k_DR7EpRaLqwamw9Ow6PZQbCuk3oQ3B22O7kmDRyVtU4aKYOuFnFktDMhd8R0NZ0eA9KY9XManKv9vsR6cDdDYMiHPBdY13Bj3BCUbIlRseQ_MNum4Q2Ae_HvFSUB3QwGQ4U94'; // Replace with your token
        await vmController.synchronizeWithDatabase(authToken);
        res.json({ message: 'Données synchronisées avec succès.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Une erreur est survenue.' });
    }
});

router.get('/', vmController.getVms);
router.delete('/:id', vmController.deleteVm);
router.delete('/', vmController.deleteVms);

module.exports = router;
