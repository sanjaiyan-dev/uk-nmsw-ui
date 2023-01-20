const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'https://nmsw-ui.dev.nmsw.homeoffice.gov.uk',
        'envName': 'development',
        'api_server': 'https://nmsw-api.dev.nmsw.homeoffice.gov.uk/v1',
        'inboxId': '486e3675-f1ce-49ae-ac1c-ce47f0b058d0'
      }
    }
);
