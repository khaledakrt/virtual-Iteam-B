const axios = require('axios');

class Networks {
  constructor(auth) {
    this.auth = auth;
    this.networkUrl = 'http://192.168.122.100:9696/v2.0';
  }

  async getNetworks() {
    try {
      if (!this.auth.token) {
        await this.auth.getToken();
      }
      const response = await axios.get(`${this.networkUrl}/networks`, {
        headers: {
          'X-Auth-Token': this.auth.token,
        },
      });
      return response.data.networks;
    } catch (error) {
      throw new Error('Failed to fetch networks: ' + error.message);
    }
  }
}

module.exports = Networks;
