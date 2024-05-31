// servergroups.js
const axios = require('axios');

class ServerGroups {
  constructor(auth) {
    this.auth = auth;
    this.computeUrl = 'http://192.168.122.100:8774/v2.1';
  }

  async getServerGroups() {
    try {
      if (!this.auth.token) {
        await this.auth.getToken();
      }
      const response = await axios.get(`${this.computeUrl}/os-server-groups`, {
        headers: {
          'X-Auth-Token': this.auth.token,
        },
      });
      return response.data.server_groups;
    } catch (error) {
      throw new Error('Failed to fetch server groups: ' + error.message);
    }
  }
}

module.exports = ServerGroups;
