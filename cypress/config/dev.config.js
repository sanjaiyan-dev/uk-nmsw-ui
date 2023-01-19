const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'https://nmsw-ui.dev.nmsw.homeoffice.gov.uk',
        'envName': 'development',
        'api_server': 'https://nmsw-api.dev.nmsw.homeoffice.gov.uk/v1',
        'inboxId': '2e47cd66-d47b-4cd7-9f8a-b33efe91ebc4'
      }
    }
);
