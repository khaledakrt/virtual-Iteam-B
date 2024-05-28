const axios = require('axios');
const VmModel = require('../models/vms');

async function getOpenStackData(authToken) {
    try {
        const api_url = 'http://192.168.122.100:8774/v2.1/servers';
        const response = await axios.get(api_url, { headers: { 'X-Auth-Token': authToken } });
        return response.data.servers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis l\'API OpenStack :', error);
        throw error;
    }
}

async function synchronizeWithDatabase(authToken) {
  try {
      const servers = await getOpenStackData(authToken);
      const serverData = [];

      for (const server of servers) {
          const serverId = server.id;
          const serverName = server.name;

          const existingServer = await VmModel.findOne({ id: serverId });

          if (!existingServer) {
              let privateIps = [];
              let floatingIps = [];

              // Fetch detailed server information
              const detailsResponse = await axios.get(`http://192.168.122.100:8774/v2.1/servers/${serverId}`, {
                headers: { 'X-Auth-Token': authToken }
              });
              const serverDetails = detailsResponse.data.server;
              const addresses = serverDetails.addresses;

              for (const networkName in addresses) {
                  for (const addressInfo of addresses[networkName]) {
                      if (addressInfo['OS-EXT-IPS:type'] === 'fixed') {
                          privateIps.push(addressInfo.addr);
                      } else if (addressInfo['OS-EXT-IPS:type'] === 'floating') {
                          floatingIps.push(addressInfo.addr);
                      }
                  }
              }

              // Join IP arrays into strings
              privateIps = privateIps.join(', ');
              floatingIps = floatingIps.join(', ');

              serverData.push({
                  id: serverId,
                  name: serverName,
                  private_ips: privateIps,
                  floating_ips: floatingIps
              });
          }
      }

      if (serverData.length > 0) {
          await VmModel.insertMany(serverData);
          console.log('Server data inserted successfully.');
      } else {
          console.log('No new data to insert.');
      }
  } catch (error) {
      console.error('Error synchronizing servers with database:', error);
  }
}

async function getVms(req, res) {
    try {
        const vms = await VmModel.find();
        res.json(vms);
    } catch (error) {
        console.error('Erreur lors de la récupération des VMs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des VMs.' });
    }
}

async function deleteVm(req, res) {
    try {
        await VmModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'VM supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la VM.' });
    }
}

async function deleteVms(req, res) {
    try {
        await VmModel.deleteMany({ _id: { $in: req.body.ids } });
        res.json({ message: 'VMs supprimées avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression des VMs.' });
    }
}

module.exports = { synchronizeWithDatabase, getVms, deleteVm, deleteVms };
