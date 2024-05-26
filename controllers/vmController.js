const axios = require('axios');
const { getOpenStackData } = require('../services/openstack');
const VmModel = require('../models/Vms');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://khakrout:Tunisie2024**@iteam-db.x2fxcnj.mongodb.net/iteam-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase the server selection timeout (in milliseconds)
    socketTimeoutMS: 45000 // Increase the socket timeout (in milliseconds)
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Once connected, call the main function
    main();
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

async function main() {
    try {
      // Retrieve OpenStack data
      const authToken = 'gAAAAABmUwi2Jf3uo2b2c8lDMTMB8hAX759j01MFcGYRtXqwQn-GpGWLv_USuESFAR0MhGl_CAwvXClLxlHnzuCWkIAtoPPli9WpB6GRpa-WtkjrN8nDkTosiBcnWSmRaX0L-O-mtOwC9K8AuAb8ynmh_gEPUvgTgLxHvd8WDt5TtmqRqtUB634';
      const openstackApiUrl = 'http://192.168.122.100:8774/v2.1/servers';
      const response = await axios.get(openstackApiUrl, {
        headers: { 'X-Auth-Token': authToken }
      });
      const servers = response.data.servers;
  
      // Prepare data for MongoDB insertion
      const serverData = [];
      for (const server of servers) {
        const serverId = server.id;
        const serverName = server.name;
  
        // Fetch detailed server information
        const detailsResponse = await axios.get(`${openstackApiUrl}/${serverId}`, {
          headers: { 'X-Auth-Token': authToken }
        });
        const serverDetails = detailsResponse.data.server;
        const addresses = serverDetails.addresses;
  
        console.log('Addresses:', addresses);
  
        // Extract private and floating IP addresses
        const privateIps = [];
        const floatingIps = [];
        for (const networkName in addresses) {
          for (const addressInfo of addresses[networkName]) {
            console.log('Address:', addressInfo.addr, 'Type:', addressInfo['OS-EXT-IPS:type']);
            if (addressInfo['OS-EXT-IPS:type'] === 'fixed') {
              privateIps.push(addressInfo.addr);
            } else if (addressInfo['OS-EXT-IPS:type'] === 'floating') {
              floatingIps.push(addressInfo.addr);
            }
          }
        }
  
        console.log('Private IPs:', privateIps);
        console.log('Floating IPs:', floatingIps);
  
        // Check if the server with the same ID already exists in the database
        const existingServer = await VmModel.findOne({ id: serverId });
        if (!existingServer) {
          // Push server data to array if it's not already in the database
          serverData.push({
            id: serverId,
            name: serverName,
            private_ips: privateIps.join(', '),
            floating_ips: floatingIps.join(', ')
          });
        }
      }

      // Save new data to MongoDB
      console.log('Server Data:', serverData); // Add this line to log serverData
      await VmModel.insertMany(serverData, { bufferCommands: false });
      console.log('Data saved successfully.');

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
}
