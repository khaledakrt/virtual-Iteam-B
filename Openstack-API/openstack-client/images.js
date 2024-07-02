const axios = require('axios');

class Images {
  constructor(auth) {
    this.auth = auth;
    this.imageUrl = 'http://192.168.122.100:9292/v2';
  }

  async getImages() {
    try {
      if (!this.auth.token) {
        await this.auth.getToken();
      }
      const response = await axios.get(`${this.imageUrl}/images`, {
        headers: {
          'X-Auth-Token': this.auth.token,
        },
      });
      return response.data.images;
    } catch (error) {
      throw new Error('Failed to fetch images: ' + error.message);
    }
  }
}

module.exports = Images;
