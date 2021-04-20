const convict = require('convict');

const config = convict({
  http: {
    listening: {
      port: {
        doc: 'The port to bind the server to.',
        format: 'port',
        default: 80,
        env: 'HTTP_LISTENING_PORT',
      },
      address: {
        doc: 'The address to bind the server to.',
        format: 'ipaddress',
        default: '::',
        env: 'HTTP_LISTENING_ADDRESS',
      },
    },
  },
  services: {
    graphql: {
      doc: 'The address of the main graphQL service.',
      default: 'http://localhost:8088/v1/graphql',
      env: 'GRAPHQL_API_URL',
    },
    maps: {
      doc: 'The address of the maps graphQL service.',
      default: 'http://localhost:4001',
      env: 'MAPS_API_URL',
    },
  },
});

config.validate();

module.exports = {
  config,
};
