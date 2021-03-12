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
  google: {
    apiKey: {
      doc: 'The Google Maps API key.',
      format: String,
      default: '',
      env: 'GOOGLE_API_KEY',
    },
  },
});

config.validate();

module.exports = {
  config,
};
