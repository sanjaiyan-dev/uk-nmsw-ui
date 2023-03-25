const {defineConfig} = require('cypress');
const defaultConfig = require('../../cypress.config');

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        'baseUrl': 'https://nmsw-ui.staging.nmsw.homeoffice.gov.uk',
        'envName': 'staging',
        'api_server': 'https://nmsw-api.staging.nmsw.homeoffice.gov.uk/v1',
        'inboxId': 'b6f7c995-d7b0-48e7-a1b6-9264b9598b37'
      }
    }
);
