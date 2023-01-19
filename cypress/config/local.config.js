const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'http://localhost:3000',
        'envName': 'development',
        'api_server': 'http://localhost:5000/v1',
        'inboxId': '33766306-fd32-4f6c-9dd0-3fa7d4e0ad8d'
      }
    }
);
