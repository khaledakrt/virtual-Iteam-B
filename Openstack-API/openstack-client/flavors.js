const axios = require('axios');

class Flavors {
  constructor(auth) {
    this.auth = auth;
    this.computeUrl = 'http://192.168.122.100:8774/v2.1';
  }

  async getFlavors() {
    try {
      if (!this.auth.token) {
        await this.auth.getToken();
      }
      const response = await axios.get(`${this.computeUrl}/flavors`, {
        headers: {
          'X-Auth-Token': this.auth.token,
        },
      });
      return response.data.flavors;
    } catch (error) {
      throw new Error('Failed to fetch flavors: ' + error.message);
    }
  }
}

module.exports = Flavors;
