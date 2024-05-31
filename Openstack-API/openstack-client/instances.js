// instances.js
const axios = require('axios');

class Instances {
    constructor(auth) {
        this.auth = auth;
        this.instanceUrl = 'http://192.168.122.100:8774/v2.1/servers';
        this.serverGroupsUrl = 'http://192.168.122.100:8774/v2.1/os-server-groups';
    }

    async getOpenStackData(url) {
        try {
            if (!this.auth.token) {
                await this.auth.getToken();
            }
            const response = await axios.get(url, { headers: { 'X-Auth-Token': this.auth.token } });
            return response.data;
        } catch (error) {
            console.error('Error retrieving data from OpenStack API:', error);
            throw error;
        }
    }

    async getInstances() {
        try {
            const serversData = await this.getOpenStackData(this.instanceUrl);
            const servers = serversData.servers;

            const serverGroupsData = await this.getOpenStackData(this.serverGroupsUrl);
            const serverGroups = serverGroupsData.server_groups;

            const serverGroupMap = serverGroups.reduce((map, group) => {
                group.members.forEach(member => {
                    map[member] = group.name;
                });
                return map;
            }, {});

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
                    status: server.status,
                    server_group: serverGroupMap[server.id] || 'None'
                };
            });

            return formattedData;
        } catch (error) {
            console.error('Error synchronizing servers with database:', error);
            throw error;
        }
    }
}

module.exports = Instances;
