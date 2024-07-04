//server.js
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminroute');
const studentRoutes = require('./routes/studentRoute');
const teacherRoutes = require('./routes/teacherRoute');
const createInstancesRoute  = require('./routes/createInstancesRoute');
const groupRoutes = require('./routes/groupRoute');


const curriculumRoutes = require('./routes/curriculumRoutes');
const requestRoutes = require('./routes/requestRoute'); // Make sure this path is correct
const dotenv = require('dotenv');
const Auth = require('./Openstack-API/openstack-client/auth');
const Flavors = require('./Openstack-API/openstack-client/flavors');
const Networks = require('./Openstack-API/openstack-client/networks');
const Images = require('./Openstack-API/openstack-client/images');
const Instances = require('./Openstack-API/openstack-client/instances');
const ServerGroups  = require('./Openstack-API/openstack-client/servergroups');
const auth_token = 'gAAAAABmht5XQf2JWMoYxwFAtqMBNsVbc5AOq8Yhjdg-3sr3syuNB--H_JTVFlzYtNlrSCrEkXFl84f__gTjMU3ZQcDnCGCe2azDPcP_7ziBh9u5uwOTSfocO-8VBblI1GKO1ihbAWeRVuNojsjwlnqoJU7ZWPuetQvaPJeUekpXH6rPkvJha4I';
const api_url = 'http://192.168.122.100:8774/v2.1/servers';
const axios = require('axios');
const { tabulate } = require('tabulate');
dotenv.config();
const path = require('path');

const aaa = require('./routes/vmsRoute');
const cors = require('cors');
const auth = new Auth();
const flavors = new Flavors(auth);
const networks = new Networks(auth);
const images = new Images(auth);
const instances = new Instances(auth);
const port = process.env.PORT || 3001;
const app = express();
const serverGroups = new ServerGroups(auth); // Correct instantiation

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

app.use('/request', requestRoutes);

app.use('/group', groupRoutes);

app.use('/create-instance', createInstancesRoute); // Use the route

// Mounting the teacherRoute
app.use('/api/teachers', teacherRoutes); // Adjust the base path as needed




app.use('/api/students', studentRoutes); // Mount student routes
app.use('/api/teachers', teacherRoutes); // Mount teacher routes






// services for vms operations
//app.use('/vms', syncRoute)
//app.use('/vms', vmsRoutes);
//app.use('/sync-data', vmsRoutes);
//app.use('/routes', vmsRoutes);
// Démarrage du serveur
// Use VM routes
app.use('/vm', aaa);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//app.use('/api', curriculumRoutes);

app.use('/students', studentRoutes);


//get information from Openstack
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

  app.get('/server-groups', async (req, res) => {
    try {
      const data = await serverGroups.getServerGroups();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch server groups: ' + error.message });
    }
  });

  app.get('/instances', async (req, res) => {
    try {
        // Retrieve server groups data
        const serverGroupsData = await serverGroups.getServerGroups();
        
        // Map server groups to create a mapping between instance IDs and their corresponding server groups
        const instanceServerGroupMap = {};
        serverGroupsData.forEach(serverGroup => {
            serverGroup.members.forEach(instanceId => {
                instanceServerGroupMap[instanceId] = serverGroup.name;
            });
        });

        // Fetch instances data
        const response = await axios.get(api_url, { headers: { 'X-Auth-Token': auth_token } });
        const servers = response.data.servers;

        // Fetch details for each instance
        const promises = servers.map(server => {
            return axios.get(`${api_url}/${server.id}`, { headers: { 'X-Auth-Token': auth_token } })
                .then(detailsResponse => {
                    const serverDetails = detailsResponse.data.server;
                    const private_ips = [];
                    const floating_ips = [];

                    if (serverDetails.addresses) {
                        for (const network in serverDetails.addresses) {
                            serverDetails.addresses[network].forEach(address => {
                                if (address['OS-EXT-IPS:type'] === 'fixed') {
                                    private_ips.push(address.addr);
                                } else if (address['OS-EXT-IPS:type'] === 'floating') {
                                    floating_ips.push(address.addr);
                                }
                            });
                        }
                    }

                    const status = serverDetails.status || 'Unknown';
                    const server_group = instanceServerGroupMap[server.id] || 'None'; // Get server group name from the mapping

                    return {
                        id: server.id,
                        name: server.name,
                        private_ips: private_ips || [],
                        floating_ips: floating_ips || [],
                        status: status,
                        server_group: server_group
                    };
                });
        });

        // Process the promises and send the instances data as response
        const instances = await Promise.all(promises);
        res.json(instances);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch instances' });
    }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
