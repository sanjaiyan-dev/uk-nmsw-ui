const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'http://localhost:3000',
        'envName': 'development',
        'api_server': 'http://localhost:5000/v1',
        'inboxId': 'b6f7c995-d7b0-48e7-a1b6-9264b9598b37'
      }
    }
);
