const axios = require('axios');

class Instances {
    constructor(authToken) {
        this.authToken = authToken;
        this.instanceUrl = 'http://192.168.122.100:8774/v2.1/servers';
    }

    async getOpenStackData() {
        try {
            const response = await axios.get(this.instanceUrl, { headers: { 'X-Auth-Token': this.authToken } });
            return response.data.servers;
        } catch (error) {
            console.error('Error retrieving data from OpenStack API:', error);
            throw error;
        }
    }

    async getInstances() {
        try {
            const servers = await this.getOpenStackData();
            const formattedData = servers.map(server => {
                const privateIps = [];
                const floatingIps = [];
    
                const addresses = server.addresses;
                if (addresses) {
                    for (const networkName in addresses) {
                        for (const addressInfo of addresses[networkName]) {
                            if (addressInfo['OS-EXT-IPS:type'] === 'fixed') {
                                privateIps.push(addressInfo.addr);
                            } else if (addressInfo['OS-EXT-IPS:type'] === 'floating') {
                                floatingIps.push(addressInfo.addr);
                            }
                        }
                    }
                }
    
                return {
                    id: server.id,
                    name: server.name,
                    private_ips: privateIps.join(', '),
                    floating_ips: floatingIps.join(', '),
                    status: server.status
                };
            });
    
            return formattedData; // Return the formatted JSON data directly
        } catch (error) {
            console.error('Error synchronizing servers with database:', error);
            throw error;
        }
    }
}

module.exports = Instances;
