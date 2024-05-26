// routes/vmsRoute.js
const express = require('express');
const router = express.Router();
const vmController = require('../controllers/vmController');

router.get('/servers', async (req, res) => {
    try {
        const authToken = 'gAAAAABmUwi2Jf3uo2b2c8lDMTMB8hAX759j01MFcGYRtXqwQn-GpGWLv_USuESFAR0MhGl_CAwvXClLxlHnzuCWkIAtoPPli9WpB6GRpa-WtkjrN8nDkTosiBcnWSmRaX0L-O-mtOwC9K8AuAb8ynmh_gEPUvgTgLxHvd8WDt5TtmqRqtUB634';
        const serverData = await vmController.getAllServers(authToken);
        res.json(serverData);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

module.exports = router;
