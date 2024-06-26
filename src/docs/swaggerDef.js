const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'example API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/profile-name/repo-name/tree/dev',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
      url: `https://example.eu/api/v1`,
    },
  ],
};

module.exports = swaggerDef;
