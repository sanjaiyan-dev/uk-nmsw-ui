const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'http://localhost:3000',
        'envName': 'development',
        'api_server': 'http://localhost:5000/v1',
        'inboxId': 'e5fc776c-a811-4cc5-9392-019f3872938b'
      }
    }
);
