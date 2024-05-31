const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const Auth = require('./openstack-client/auth');
const Flavors = require('./openstack-client/flavors');
const Networks = require('./openstack-client/networks');
const Images = require('./openstack-client/images');
const Instances = require('./openstack-client/instances');
const ServerGroups = require('./openstack-client/servergroups'); // Import the new class
dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 4000;

const auth = new Auth();
const flavors = new Flavors(auth);
const networks = new Networks(auth);
const images = new Images(auth);
const instances = new Instances(auth); // Initialize the Instances class with auth
const serverGroups = new ServerGroups(auth); // Initialize the ServerGroups class with auth

app.get('/flavors', async (req, res) => {
  try {
    const data = await flavors.getFlavors();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flavors: ' + error.message });
  }
});

app.get('/networks', async (req, res) => {
  try {
    const data = await networks.getNetworks();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch networks: ' + error.message });
  }
});

app.get('/images', async (req, res) => {
  try {
    const data = await images.getImages();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images: ' + error.message });
  }
});

app.get('/instances', async (req, res) => {
  try {
    const data = await instances.getInstances();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch instances: ' + error.message });
  }
});

app.get('/server-groups', async (req, res) => {
  try {
    const data = await serverGroups.getServerGroups();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch server groups: ' + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
