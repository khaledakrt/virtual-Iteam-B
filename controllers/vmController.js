const axios = require('axios');
const VmModel = require('../models/vms');

async function getOpenStackData(authToken) {
    try {
        const apiUrl = 'http://192.168.122.100:8774/v2.1/servers';
        const response = await axios.get(apiUrl, { headers: { 'X-Auth-Token': authToken } });
        return response.data.servers;
    } catch (error) {
        console.error('Error retrieving data from OpenStack API:', error);
        throw error;
    }
}

async function getServerGroups(authToken) {
    try {
        const apiUrl = 'http://192.168.122.100:8774/v2.1/os-server-groups';
        const response = await axios.get(apiUrl, { headers: { 'X-Auth-Token': authToken } });
        return response.data.server_groups;
    } catch (error) {
        console.error('Error retrieving server groups from OpenStack API:', error);
        throw error;
    }
}

async function synchronizeWithDatabase(authToken) {
    try {
        const servers = await getOpenStackData(authToken);
        const serverGroups = await getServerGroups(authToken);
        
        // Create a map of server ID to server group names
        const serverGroupMap = {};
        for (const group of serverGroups) {
            for (const memberId of group.members) {
                if (!serverGroupMap[memberId]) {
                    serverGroupMap[memberId] = [];
                }
                serverGroupMap[memberId].push(group.name);
            }
        }

        const serverData = [];
        for (const server of servers) {
            const serverId = server.id;
            const serverName = server.name;

            const existingServer = await VmModel.findOne({ id: serverId });
            if (!existingServer) {
                const privateIps = [];
                const floatingIps = [];

                // Fetch details of the server to get its status
                const detailsResponse = await axios.get(`http://192.168.122.100:8774/v2.1/servers/${serverId}`, {
                    headers: { 'X-Auth-Token': authToken }
                });
                const serverDetails = detailsResponse.data.server;
                const status = serverDetails.status;

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

                serverData.push({
                    id: serverId,
                    name: serverName,
                    private_ips: privateIps,
                    floating_ips: floatingIps,
                    status: status,
                    server_group: serverGroupMap[serverId] ? serverGroupMap[serverId].join(', ') : 'None'
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
        console.error('Error retrieving VMs:', error);
        res.status(500).json({ error: 'Error retrieving VMs.' });
    }
}

async function deleteVm(req, res) {
    try {
        await VmModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'VM deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting VM.' });
    }
}

async function deleteVms(req, res) {
    try {
        await VmModel.deleteMany({ _id: { $in: req.body.ids } });
        res.json({ message: 'VMs deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting VMs.' });
    }
}

module.exports = { synchronizeWithDatabase, getVms, deleteVm, deleteVms };
