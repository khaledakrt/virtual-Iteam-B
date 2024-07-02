//auth.js
const axios = require('axios');

class Auth {
  constructor() {
    this.authUrl = process.env.AUTH_URL || 'http://192.168.122.100:5000/v3';
    this.username = process.env.OS_USERNAME || 'admin';
    this.password = process.env.OS_PASSWORD || 'kolla';
    this.projectId = process.env.OS_PROJECT_ID || '0020679740e74a2db9c5f87cc16e76b8';
    this.token = null;
  }

  async getToken() {
    try {
      const response = await axios.post(`${this.authUrl}/auth/tokens`, {
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                name: this.username,
                domain: { id: 'default' },
                password: this.password,
              },
            },
          },
          scope: {
            project: {
              id: this.projectId,
            },
          },
        },
      });
      this.token = response.headers['x-subject-token'];
      return this.token;
    } catch (error) {
      throw new Error('Failed to authenticate with OpenStack: ' + error.message);
    }
  }
}

module.exports = Auth;
