const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'https://nmsw-ui.dev.nmsw.homeoffice.gov.uk',
        'envName': 'development',
        'api_server': 'https://nmsw-api.dev.nmsw.homeoffice.gov.uk/v1',
        'inboxId': '192541de-22fc-4aa6-839f-64d14ebc9693'
      }
    }
);
