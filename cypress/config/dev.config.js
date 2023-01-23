const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'https://nmsw-ui.dev.nmsw.homeoffice.gov.uk',
        'envName': 'development',
        'api_server': 'https://nmsw-api.dev.nmsw.homeoffice.gov.uk/v1',
        'inboxId': '98748f98-2dcf-41b8-8bc9-9627e6cd0d80'
      }
    }
);
