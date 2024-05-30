const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Auth = require('./openstack-client/auth');
const Flavors = require('./openstack-client/flavors');
const Networks = require('./openstack-client/networks');
const Images = require('./openstack-client/images');
const Instances = require('./openstack-client/instances');
const auth_token = 'gAAAAABmWIXXuxWaSPYqpkmLfflEY8D-mS_rdY3PSyNtt1lnxEGGpsJpeMFA47q4-U6cJlVph_DdehyBbs10L7HqAzM_1AI-EelFGOxY4an1jpTYpEQJlhAQ98L_QazzPXMnanCWkuGbKPxBko9n9zdUIMzwLdsX0juQuyMaNcjZW83lD2wI7mo';
const api_url = 'http://192.168.122.100:8774/v2.1/servers';
const axios = require('axios');
const { tabulate } = require('tabulate');
dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 4000;

const auth = new Auth();
const flavors = new Flavors(auth);
const networks = new Networks(auth);
const images = new Images(auth);
const instances = new Instances(auth);

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

app.get('/instances', (req, res) => {
    axios.get(api_url, { headers: { 'X-Auth-Token': auth_token } })
        .then(response => {
            const servers = response.data.servers;
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
                        const server_group = serverDetails['os-extended-server-groups:server_group'] || 'None';

                        return [server.id, server.name, private_ips.join(', ') || 'No private IPs', floating_ips.join(', ') || 'No floating IPs', status, server_group];
                    });
            });

            return Promise.all(promises);
        })
        .then(tableData => {
            const table = tableData.map(row => `| ${row.join(' | ')} |`).join('\n');
            const headers = '| ID | Name | Private IP Addresses | Floating IP Addresses | Status | Server Group |';
            const result = headers + '\n' + table;
            res.send(result);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch instances' });
        });
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
